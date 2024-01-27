import {
  ConsecutiveBreaker,
  ExponentialBackoff,
  retry,
  handleAll,
  circuitBreaker,
  wrap,
} from "cockatiel";
// import { database } from "./my-db";
import { fetchData } from "./getdata";

// Create a retry policy that'll try whatever function we execute 3
// times with a randomized exponential backoff.
const retryPolicy = retry(handleAll, {
  maxAttempts: 8,
  backoff: new ExponentialBackoff(),
});

// Create a circuit breaker that'll stop calling the executed function for 10
// seconds if it fails 5 times in a row. This can give time for e.g. a database
// to recover without getting tons of traffic.
const circuitBreakerPolicy = circuitBreaker(handleAll, {
  halfOpenAfter: 10 * 1000,
  breaker: new ConsecutiveBreaker(5),
});

// Combine these! Create a policy that retries 3 times, calling through the circuit breaker
const retryWithBreaker = wrap(retryPolicy, circuitBreakerPolicy);

const handleRequest = async (from: string) => {
  // Call your database safely!
  const data = await retryWithBreaker.execute(async (ctx) => {
    console.log({ from, ctx });
    const data = await fetchData("3000", true, 200);
    return data;
  });
  console.log({ data });
};

const handleRequests = [
  handleRequest("a"),
  handleRequest("b"),
  handleRequest("c"),
];

Promise.all(handleRequests)
  .then(() => "done")
  .catch((e) => {
    console.log("at then end catch");
    console.log({ e });
  });

// handleRequest()
//   .then(() => "done")
//   .catch((e) => {
//     console.log("at the end");
//     console.log(e.cause);
//   });

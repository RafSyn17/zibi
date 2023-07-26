class SegmentedSieve {
    constructor() {
        this.sieve = [];
        this.primes = [];
        this.n = 2;
    }

    updateSieve(m) {
        let primes = this.sieve;
        for (let i = 2; i <= m; i++)
            if (primes[i] === undefined) { // i has not been marked, hence it is a prime
                primes[i] = true;
                if (i * i <= m)
                    for (let j = i * i; j <= m; j += i)
                        primes[j] = false;
            }

        // Update the stored primes
        for (let i = this.n; i <= m; i++)
            if (primes[i])
                this.primes.push(i);
        this.n = m + 1;
    }

    generatePrimesUpTo(m) {
        if (m > 50000000)
            throw new Error('Not allowed to generate primes up to higher than 50000000 to prevent too high memory usage');
        if (m >= this.n)
            this.updateSieve(m);
    }

    isPrime(num) {
        if (num < this.n)
            return this.primes.includes(num);
        else
            throw new Error('The number is larger than the maximum number used for generating primes');
    }
}

function isPrimeSimple(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++)
        if (num % i === 0) return false;
    return true;
}

let sieve = new SegmentedSieve();
let useEraSieve = false;
let doStoreSimpleResults = true;
let storedSimpleResults = new Map();


function isPrimeSimpleStore(zahl) {
    if (storedSimpleResults.has(zahl))
        return storedSimpleResults.get(zahl);
    let result = isPrimeSimple(zahl);
    if (doStoreSimpleResults)
        storedSimpleResults.set(zahl, result);
    return result;
}

function isPrimeSieve(x) {
    const step = 1000000;
    const gen = Math.ceil(x / step) * step;
    sieve.generatePrimesUpTo(gen);
    return sieve.isPrime(x);
}

function isPrime(x) {
    if (useEraSieve)
        return isPrimeSieve(x);
    else
        return isPrimeSimpleStore(x);
}

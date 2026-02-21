import time
import threading


class RateLimiter:
    """Token-bucket rate limiter for API calls."""

    def __init__(self, max_calls: int = 10, period: float = 60.0):
        self.max_calls = max_calls
        self.period = period
        self.calls: list[float] = []
        self.lock = threading.Lock()

    def wait(self):
        with self.lock:
            now = time.monotonic()
            self.calls = [t for t in self.calls if now - t < self.period]
            if len(self.calls) >= self.max_calls:
                sleep_time = self.period - (now - self.calls[0])
                if sleep_time > 0:
                    time.sleep(sleep_time)
                self.calls = [
                    t for t in self.calls if time.monotonic() - t < self.period
                ]
            self.calls.append(time.monotonic())

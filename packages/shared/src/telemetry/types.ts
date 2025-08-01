export type TelemetryCollectorOptions = {
  /**
   * If true, telemetry will not be collected.
   */
  disabled?: boolean;
  /**
   * If true, telemetry will not be sent, but collected events will be logged to the console.
   */
  debug?: boolean;
  /**
   * Sampling rate, 0-1
   */
  samplingRate?: number;
  /**
   * Set a custom buffer size to control how often events are sent
   */
  maxBufferSize?: number;
  /**
   * The publishableKey to associate with the collected events.
   */
  publishableKey?: string;
  /**
   * The secretKey to associate with the collected events.
   */
  secretKey?: string;
  /**
   * The current clerk-js version.
   */
  clerkVersion?: string;
  /**
   * The SDK being used, e.g. `@appypeeps/clerk-nextjs` or `@appypeeps/clerk-remix`.
   */
  sdk?: string;
  /**
   * The version of the SDK being used.
   */
  sdkVersion?: string;
};

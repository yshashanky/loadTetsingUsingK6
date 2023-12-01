### About the Implementation:

- The complete implementation will be done using the open-source component of the [k6 framework](https://k6.io/open-source/).
- We can run load tests for all the APIs using a single command.
- In this context, `k6.exe` is an overridden executable file for k6, which is capable of generating custom reports.
- Generated reports (HTML and JSON) will be stored in the "reports" folder.
- In the "controllers" folder, you will find separate implementations for each API.
- Created build task to make it easier to run the load test.

### Requirement:

- [Visual Studio IDE](https://code.visualstudio.com/).

### How to Run:

1. Clone the repository from [gitlab](https://gitlab.tools.ocean.com/cee/ocean-now/performance-test.git).
2. Checkout 'develop' branch and open it in VS Code
3. Select 'CTRL+Shift+B' or 'CTRL+CMD+B', it will start the process.
4. Wait until the process is completed.

#### About the run Command:

```
.\k6.exe run --out 'dashboard=period=1s&report=.\reports\loadTestCustomReport.html' main.js
```

- `.\k6.exe` is to specify the path of the k6 executable file.
- The "dashboard" section provides various options for generating custom reports:

  1. **Period Option:** This option defines the time interval in seconds at which data will be transmitted and displayed in the report.

  2. **Report Option:** With this option, you can specify the location where the report will be saved.

### Custom report description:

#### Overview:

- VUs -> Current number of active virtual users
- Transfer Rate -> Amount of data sent and received
- HTTP Request Duration -> Total time for the request
- Iteration Duration -> The time to complete one full iteration

#### Timings:

- Request Duration -> Total time for the request
- Request Waiting -> Time spent waiting for response from remote host a.k.a. “time to first byte"
- TLS handshaking -> Time spent handshaking TLS session with remote host
- Request Sending -> Time spent sending data to the remote host
- Request Connecting -> Time spent establishing TCP connection to the remote host
- Request Receiving -> Time spent receiving response data from the remote host

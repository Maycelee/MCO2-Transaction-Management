# MCO2-Transaction-Management
To run the application, perform the following steps:
1. Clone the repository.
2. Open CMD (or any terminal) and navigate to the path of the folder where the repository files are located.
3. Input npm install in the terminal then node index.js
4. Wait for preferred browser to open.

### Abstract
This paper aims to understand transaction management by performing concurrent transactions in a distributed database system. To simulate multi-user access, the researchers built a three-node distributed database system in a cloud service connected to a web application. The researchers performed tests on the system under the following categories: (1) Concurrency Control, (2) Consistency, and (3) Global Failure Recovery. For concurrency and consistency, the database is expected to remain consistent during the execution of concurrent transactions - all transactions are reading data, all transactions are writing data, and one transaction is writing while the other transactions are reading data. For global failure recovery, databases are closed to simulate a crash. The transaction is expected to go through and execute properly by performing a recovery. Through the experiment, it is determined that concurrent transactions should not affect the performance of the web application and the distributed database system.

### Keywords
*Distributed Database System, Concurrency Control, Replication, Consistency,  Global Failure Recovery*

# MCO2-Transaction-Management
The course project on Transactions Management is a venue for students to practice building a distributed database system that supports concurrent multi-user access.
Students will once again use the IMDB_ijs dataset to design a three-node distributed database system where they perform concurrent transactions and simulate crash
and recovery techniques. The final output will be a software that will be demonstrated during the indicated schedule to the respective STADVDB teachers, and a test
script showing the results of performing the different test cases described below on your software.

### Step 1.      Build a Distributed Database System
Create three (3) nodes – with three (3) separate computers that are connected and can communicate with each other. Each node should have its own database with the
following contents:
- Node 1 (Central Node): All Movies – repository of ALL data 
- Node 2: Movies < 1980 – repository of the dataset from before 1980s
- Node 3: Movies >= 1980  – repository of the dataset from 1980s onwards

### Step 2.      Concurrency Control and Consistency
Create an application to simulate a global concurrency control for the distributed system. The application should be able to show two or more transactions concurrently
executing with each other and they all leave the database in a consistent state. Three cases to simulate:

- Case #1: All transactions are reading.
- Case #2: At least one transaction is writing (update / deletion) and the others are reading.
- Case #3: All transactions are writing (update / deletion).
Notes:
For each case, set the isolation level to read uncommitted, read committed, read repeatable and serializable.
Updates in either Node 2 or Node 3 should be replicated in the central node. Any updates in the central node should be replicated in either Node 2 or Node 3.

### Step 3.      Global Failure Recovery
Extend the application to simulate global crash and recovery. Show how the system recovers from failures when global transactions are executing. There are four cases
to simulate:
- Case #1: Transaction failure in writing to central node when attempting to replicate the transaction from Node 1 or Node 2
- Case #2: Transaction failure in writing to Node 2 and Node 3 when attempting to replicate the transaction from central node
- Case #3: The central node is unavailable during the transaction and then eventually comes back online.
- Case #4: Node 2 or Node 3 is unavailable during the transaction and then eventually comes back online.
 
### Step 4.      Evaluation
Write a test script to cover all the test cases described in Steps 2 and 3. Execute each of your test cases at least 3 times and log the results. Remember that testing
should be efficient and effective.

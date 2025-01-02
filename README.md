# 🕷️ **Spider Search Engine Project** 🚀

Welcome to the **Spider Search Engine Project**! 🌐 This project implements a **web crawling search engine** designed to gather, index, and rank documents from the web. The goal is to create an efficient system that searches, indexes, and ranks web pages based on their relevance to user queries.

---

## 🎯 **Core Features Overview** 🎯

### 🕷️ **Spider (Web Crawler)**
The heart of the Spider Search Engine is its **web crawler**, which is responsible for crawling websites and gathering data.

- **Crawl websites** starting from a list of seed URLs 🌍.
- **Download HTML pages** and extract hyperlinks to recursively crawl more pages 🔗.
- **Multithreaded crawling** to optimize performance and increase crawl speed 🕸️.
- Respect **robots.txt** files for ethical web scraping 🤖.
- Crawl depth and page count can be controlled for efficiency (set to 6000 pages for this project) 📄.

---

### 🔎 **Indexer**
The **Indexer** organizes the crawled data for fast and efficient searching.

- **Inverted index** structure for quick retrieval of relevant documents 🔄.
- Indexes **words and their corresponding documents**, making searches faster and more accurate ⚡.
- Supports incremental indexing, allowing for real-time updates 🔄.

---

### 🔄 **Query Processor**
The **Query Processor** is responsible for interpreting user search queries and retrieving relevant documents from the index.

- Processes user queries to match words with indexed documents 🧠.
- Supports **logical operators** like AND, OR, and NOT to refine search results 🔍.
- Performs **stemming** to account for different word forms (e.g., running vs. run) 🌱.

---

### 🏆 **Ranker**
The **Ranker** ensures that the most relevant documents appear first in search results.

1. **Relevance ranking** based on keyword frequency, document position, and metadata 🥇.
2. Optionally incorporates **link analysis** (e.g., PageRank) for better ranking of popular pages 🔗.

---

### 📑 **Document Retrieval**
Efficient document retrieval is essential for providing users with relevant results quickly.

- **Highlight query matches** in snippets displayed to the user 📄.
- Retrieves documents from the index based on exact keyword matches and ranked relevance.

---

### 📁 **Data Storage**
Data collected from the web is stored in a way that allows efficient searching and updating.

- **Crawled data**: Stores HTML documents and metadata (URLs, titles, etc.) for later indexing 🗄️.
- **Inverted index**: Uses a custom data structure to store and retrieve word-to-document mappings efficiently 💾.

---

## 🚀 **Getting Started**

These instructions will guide you on setting up the Spider Search Engine locally for development and testing purposes.

### **Prerequisites**
Before you begin, ensure you have the following installed on your machine:

- **Java** (JDK 11 or higher) - [Download here](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- **Maven** (for building the project) - [Download here](https://maven.apache.org/)
- **Git** (for cloning the repository) - [Download here](https://git-scm.com/)

### **Installation**

1. **Clone the repository**:

   ```bash
   git clone https://github.com/omarhashem80/Spider-Search-Engine
   cd Spider-Search-Engine
   ```

2. **Build the project**:

   ```bash
   mvn clean install
   ```

3. **Run the application**:

   ```bash
   mvn spring-boot:run
   ```

---

## 🖥️ **Available Scripts**

- **`mvn spring-boot:run`** – Starts the Spider Search Engine and begins the crawling process.
- **`mvn clean install`** – Builds the project and prepares it for deployment.

---

## 👥 **Contributors**

- **[Omar Hashem](https://github.com/omarhashem80)** – Crawler & Query Processor 🕷️🔍
- **[Abdelrahman Mohamed Abdelaty](https://github.com/Abdelrahman-Mohamed-Abdelaty)** – Ranker 🏆
- **[Youssef Bahy](https://github.com/Youssef-Bahy-Youssef)** – Indexer 📚
- **[Ali Afifi](https://github.com/Ali-Afifi-Hussain)** – Web Interface & Phrase Searching 🌐🔑

---

## 🌟 **Thank you for exploring the Spider Search Engine!**

We’re excited to have you join us on this journey of creating a powerful search engine. We look forward to your contributions in improving and expanding the functionality of this project! 🚀

---

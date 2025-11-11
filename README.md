🌐 Latency Topology Visualizer
The application is a high-performance Next.js solution utilizing TypeScript and React-Three-Fiber (Three.js) to render an interactive 3D world map. It visualizes the real-time and historical network latency between major cryptocurrency exchange servers and co-location regions across AWS, GCP, and Azure.

Key Features Implemented
•	3D World Map & Interactivity: Built with react-three-fiber and drei. Supports rotation, zoom, and pan. Markers for exchanges and cloud regions are plotted using coordinate conversion utilities.

•	Real-time Latency Visualization: Animated, arcing lines (Bézier curves) connect exchanges to regions. Connections are dynamically color-coded (Green/Yellow/Red) based on simulated latency, updating every 7 seconds.

•	Historical Trends: A dedicated HistoricalChartPanel using Recharts displays time-series data, including Min, Max, and Average latency statistics with time range selectors (1h, 24h, 7d, 30d).

•	Interactive Controls: A responsive Control Panel allows users to filter the visualization by Cloud Provider and Exchange Server and includes a toggle for the connection layer.

•	Technical Stack: Uses TypeScript, Next.js, and React Context API for robust state management.

⚠️ Assumptions Made & Data Source
A free, reliable, and real-time API for measuring latency between specific crypto exchange co-location points and cloud regions is unavailable. Therefore, the requirement for real-time data was fulfilled via simulation:
Latency Simulation: A dedicated utility, src/utils/latencySimulator.ts, was implemented to generate realistic, fluctuating time-series latency values that are pushed into the global application state via the LatencyContext at regular intervals. 

Libraries Used
•	Next.js (React/TypeScript): Core framework.
•	Three.js / @react-three/fiber / @react-three/drei: For 3D scene rendering, controls, and managing 3D components declaratively.
•	Recharts: Used for generating the responsive historical time-series charts.
•	Tailwind CSS: Used for fast, modern, and responsive styling of the 2D Control Panel.


🛠️ Local Setup and Running Instructions
This project requires Node.js (LTS) and npm to run.

•	Clone the Repository: git clone https://github.com/Aayushnhk/LATENCY-TOPOLOGY-VISUALIZER

•	cd latency-topology-visualizer

•	Install Dependencies: npm install

•	Run the Development Server (using Turbopack):  npm run dev

•	Access the Application: Open your browser and navigate to http://localhost:3000.



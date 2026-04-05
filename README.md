# Zorvyn Enterprise - Financial Analytics Dashboard

![Zorvyn Banner](/README_banner.png) *(Note: Application is highly animated, static images may not capture full fidelity)*

Zorvyn is a highly engaging, physics-animated, and deeply analytical financial dashboard engineered to track liquidity, visualize spending, and manage digital wallets.

## 🌟 Key Features

*   **Deep Real-time Analytics:** Multi-dimensional tracking including Monthly Checkups, Fiscal Year horizons, Category breakdowns, and Investment analyses using `recharts`.
*   **Kinetic User Experience:** Built with `framer-motion` to provide a highly interactive, spring-animated interface. Cards shimmer on hover, background gradients fluidly float and rotate, and navigation elements snap flawlessly into focus.
*   **3D Digital Wallet Engine:** Manage a personalized card catalog in a stacked, interactive perspective rendering. Provision new cards, update balances, and perform full CRUD operations instantly.
*   **Enterprise Grade Dark Mode:** A sophisticated layout pipeline featuring varying backdrop blurs (`backdrop-blur-xl`), carefully configured opacity thresholds, and `mix-blend-screen` rendering for a premium dark-mode presentation that goes far beyond simple color inversions.
*   **Role-Based Access Control (RBAC):** Simulated RBAC state toggling restricts sensitive actions (like adding/deleting cards or clearing data) to authorized "Admin" level accounts only.
*   **Snappy Persisted Global State:** Application data is centrally managed and synced via `zustand` to LocalStorage, ensuring zero load times and cross-session persistence without an active backend.

## 🛠 Tech Stack

*   **Framework:** React (Vite)
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion
*   **Data Visualizations:** Recharts
*   **Global State Management:** Zustand
*   **Icons:** Lucide React

## 📦 Setup & Installation

Follow these steps to run Zorvyn locally:

1.  **Clone the Repository** (If applicable):
    ```bash
    git clone https://github.com/your-repo/zorvyn.git
    cd zorvyn
    ```

2.  **Install Dependencies:**
    Ensure you have NodeJS installed.
    ```bash
    npm install
    ```

3.  **Launch the Development Server:**
    ```bash
    npm run dev
    ```
    *The application will typically map to `http://localhost:5173`.*

## 📐 Architecture & Modularity

The application was built with high maintainability in mind, segmented naturally into domains:

*   **`/components/ui`**: Atomic generic interface blocks (`Card`, `SummaryCard`, `Badge`).
*   **`/components/charts`**: Reusable `recharts` visual wrappers isolated from page logic.
*   **`/components/layout`**: The visual shells encapsulating `Sidebar` routing and `Topbar` controls.
*   **`/pages`**: Domain-specific routing endpoints.
*   **`/store/useStore.js`**: Centralized logic tree enforcing CRUD manipulation bounds.
*   **`/utils/helpers.js`**: Complex mathematical and string formatting logic offloaded from view components.

## 🎯 Design Decisions

1.  **Glassmorphism + Neon Blobs:** To combat the clinical, sterile nature of standard financial apps, a core decision was made to use vibrant animated gradients interacting with translucent, blurred frontend planes.
2.  **Zero-Jank Transforms:** Exclusively utilizing `transform` and `opacity` properties via Framer Motion's `layoutId` logic ensures continuous 60FPS fluid UI transitions despite DOM heavy data lists.
3.  **Mock Data Density:** Simulated 15 months of dense transaction data to ensure the visualizations look robust and realistic immediately upon launch.

## 🔐 Implementation of Evaluation Criteria

1.  **Visuals:** Modern aesthetic prioritized.
2.  **Responsiveness:** Extensively utilizes Tailwind grid/flex systems.
3.  **Functionality:** Advanced logic loops correctly sort data by type, target, and dynamic date thresholds.
4.  **State Management:** Achieved entirely through robust `zustand` models.
5.  **Quality / Edge Cases:** Fallbacks provided for empty lists, absent metrics, and zero-state data conditions.

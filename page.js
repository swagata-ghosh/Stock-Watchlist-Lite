"use client";

import { useState, useEffect } from "react";
import "./globals.css";

// ---------------------- Dummy Data ----------------------
const dummyData = [
  { id: 1, tradingSymbol: "RELIANCE", capitalMarketLastTradedPrice: 2915.45, futuresLastTradedPrice: 2921.10, percentageChange: 0.84, lastUpdatedTimestamp: new Date().toISOString() },
  { id: 2, tradingSymbol: "TCS", capitalMarketLastTradedPrice: 3712.20, futuresLastTradedPrice: 3715.75, percentageChange: -0.45, lastUpdatedTimestamp: new Date().toISOString() },
  { id: 3, tradingSymbol: "HDFC", capitalMarketLastTradedPrice: 2450.80, futuresLastTradedPrice: 2455.25, percentageChange: 1.25, lastUpdatedTimestamp: new Date().toISOString() },
  { id: 4, tradingSymbol: "INFY", capitalMarketLastTradedPrice: 1850.50, futuresLastTradedPrice: 1848.75, percentageChange: -0.32, lastUpdatedTimestamp: new Date().toISOString() },
  { id: 5, tradingSymbol: "SBIN", capitalMarketLastTradedPrice: 550.75, futuresLastTradedPrice: 552.30, percentageChange: 0.68, lastUpdatedTimestamp: new Date().toISOString() },
  { id: 6, tradingSymbol: "ICICI", capitalMarketLastTradedPrice: 920.40, futuresLastTradedPrice: 918.90, percentageChange: -0.16, lastUpdatedTimestamp: new Date().toISOString() },
  { id: 7, tradingSymbol: "WIPRO", capitalMarketLastTradedPrice: 480.30, futuresLastTradedPrice: 481.50, percentageChange: 0.25, lastUpdatedTimestamp: new Date().toISOString() },
  { id: 8, tradingSymbol: "HINDUNILVR", capitalMarketLastTradedPrice: 2550.00, futuresLastTradedPrice: 2558.45, percentageChange: 1.12, lastUpdatedTimestamp: new Date().toISOString() },
  { id: 9, tradingSymbol: "ITC", capitalMarketLastTradedPrice: 420.65, futuresLastTradedPrice: 419.80, percentageChange: -0.20, lastUpdatedTimestamp: new Date().toISOString() },
  { id: 10, tradingSymbol: "AXIS", capitalMarketLastTradedPrice: 980.25, futuresLastTradedPrice: 982.75, percentageChange: 0.51, lastUpdatedTimestamp: new Date().toISOString() },
  { id: 11, tradingSymbol: "KOTAKBANK", capitalMarketLastTradedPrice: 1750.90, futuresLastTradedPrice: 1755.40, percentageChange: 0.86, lastUpdatedTimestamp: new Date().toISOString() },
  { id: 12, tradingSymbol: "BAJFINANCE", capitalMarketLastTradedPrice: 6850.75, futuresLastTradedPrice: 6865.25, percentageChange: 1.45, lastUpdatedTimestamp: new Date().toISOString() }
];

// ---------------------- Utils ----------------------
const formatCurrency = (value) => new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
const formatPercentage = (value) => `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;

const generateChartData = (basePrice) => {
  const data = [];
  let price = basePrice;
  for (let i = 29; i >= 0; i--) {
    price += (Math.random() - 0.5) * 10;
    data.unshift({ time: i + "m", price });
  }
  return data;
};

const fetchDummyData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.1) reject(new Error("Failed to fetch data"));
      else resolve(dummyData.map(stock => ({
        ...stock,
        lastUpdatedTimestamp: new Date(Date.now() - Math.floor(Math.random() * 300000)).toISOString(),
        capitalMarketLastTradedPrice: parseFloat((stock.capitalMarketLastTradedPrice * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2)),
        futuresLastTradedPrice: parseFloat((stock.futuresLastTradedPrice * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2)),
        percentageChange: parseFloat((stock.percentageChange + (Math.random() - 0.5) * 0.5).toFixed(2))
      })));
    }, 1000);
  });
};

// ---------------------- Custom Hooks ----------------------
const useRelativeTime = (timestamp) => {
  const [relativeTime, setRelativeTime] = useState("");
  useEffect(() => {
    const update = () => {
      const diff = Math.floor((new Date() - new Date(timestamp)) / 1000);
      if (diff < 60) setRelativeTime(`${diff} sec ago`);
      else if (diff < 3600) setRelativeTime(`${Math.floor(diff / 60)} min ago`);
      else if (diff < 86400) setRelativeTime(`${Math.floor(diff / 3600)} hours ago`);
      else setRelativeTime(`${Math.floor(diff / 86400)} days ago`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timestamp]);
  return relativeTime;
};

// ---------------------- Components ----------------------
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-line short"></div>
    <div className="skeleton-line"></div>
    <div className="skeleton-line"></div>
    <div className="skeleton-line" style={{ width: "70%" }}></div>
    <div className="skeleton-line" style={{ width: "40%" }}></div>
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="error-state">
    <div className="error-icon">⚠️</div>
    <h3>Something went wrong</h3>
    <p className="error-message">We couldn't load the stock data. Please try again.</p>
    <button className="retry-btn" onClick={onRetry}>Retry</button>
  </div>
);

const StockCard = ({ stock, viewMode, onCardClick, onToggleView }) => {
  const relativeTime = useRelativeTime(stock.lastUpdatedTimestamp);
  return (
    <div className="stock-card" onClick={() => onCardClick(stock)}>
      <div className="stock-header">
        <div className="stock-symbol">{stock.tradingSymbol}</div>
        <div className={`percentage-change ${stock.percentageChange >= 0 ? "positive" : "negative"}`}>
          {formatPercentage(stock.percentageChange)}
        </div>
      </div>
      <div className="price-container">
        {viewMode === "A" ? (
          <>
            <div className="price-row">
              <span className="price-label">Futures LTP:</span>
              <span className="price-value">₹{formatCurrency(stock.futuresLastTradedPrice)}</span>
            </div>
            <div className="price-row">
              <span className="price-label">Capital LTP:</span>
              <span className="price-value">₹{formatCurrency(stock.capitalMarketLastTradedPrice)}</span>
            </div>
          </>
        ) : (
          <>
            <div className="price-row">
              <span className="price-label">Capital LTP:</span>
              <span className="price-value">₹{formatCurrency(stock.capitalMarketLastTradedPrice)}</span>
            </div>
            <div className="price-row">
              <span className="price-label">Futures LTP:</span>
              <span className="price-value">₹{formatCurrency(stock.futuresLastTradedPrice)}</span>
            </div>
          </>
        )}
      </div>
      <button
        className="toggle-btn"
        onClick={(e) => {
          e.stopPropagation();
          onToggleView();
        }}
      >
        Switch to View {viewMode === "A" ? "B" : "A"}
      </button>
      <div className="timestamp">Updated {relativeTime}</div>
    </div>
  );
};

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };
  return <input type="text" className="search-bar" placeholder="Search by symbol..." value={query} onChange={handleChange} />;
};

const SortMenu = ({ onSort }) => {
  const [sortBy, setSortBy] = useState("default");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSortByChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    onSort(value, sortOrder);
  };

  const handleOrderChange = (e) => {
    const value = e.target.value;
    setSortOrder(value);
    onSort(sortBy, value);
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <select className="sort-menu" value={sortBy} onChange={handleSortByChange}>
        <option value="default">Default Order</option>
        <option value="percentageChange">Percentage Change</option>
        <option value="capitalMarketLastTradedPrice">Capital LTP</option>
        <option value="futuresLastTradedPrice">Futures LTP</option>
      </select>
      <select className="sort-menu" value={sortOrder} onChange={handleOrderChange}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

const StockDrawer = ({ stock, isOpen, onClose }) => {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    if (stock) setChartData(generateChartData(stock.capitalMarketLastTradedPrice));
  }, [stock]);

  if (!isOpen || !stock) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2>{stock.tradingSymbol}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <h3>Price Chart (Last 30 minutes)</h3>
        <div className="chart-container">
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
            <p>Price chart placeholder</p>
          </div>
        </div>

        <div className="drawer-details">
          <h3>Stock Details</h3>
          <div className="detail-row"><span className="detail-label">Trading Symbol:</span> <span className="detail-value">{stock.tradingSymbol}</span></div>
          <div className="detail-row"><span className="detail-label">Capital Market LTP:</span> <span className="detail-value">₹{formatCurrency(stock.capitalMarketLastTradedPrice)}</span></div>
          <div className="detail-row"><span className="detail-label">Futures LTP:</span> <span className="detail-value">₹{formatCurrency(stock.futuresLastTradedPrice)}</span></div>
          <div className="detail-row"><span className="detail-label">Percentage Change:</span> <span className={`detail-value ${stock.percentageChange >= 0 ? "positive" : "negative"}`}>{formatPercentage(stock.percentageChange)}</span></div>
          <div className="detail-row"><span className="detail-label">Last Updated:</span> <span className="detail-value">{new Date(stock.lastUpdatedTimestamp).toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
};

// ---------------------- Main Component ----------------------
export default function Home() {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedStock, setSelectedStock] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState("A");

  useEffect(() => { loadData(); }, []);
  useEffect(() => { filterAndSortStocks(); }, [stocks, searchQuery, sortBy, sortOrder]);

  const loadData = async () => {
    try { setLoading(true); setError(false); const data = await fetchDummyData(); setStocks(data); }
    catch (err) { setError(true); console.error(err); }
    finally { setLoading(false); }
  };

  const filterAndSortStocks = () => {
    let result = [...stocks];
    if (searchQuery) result = result.filter(s => s.tradingSymbol.toLowerCase().includes(searchQuery.toLowerCase()));
    if (sortBy !== "default") {
      result.sort((a, b) => {
        let valueA, valueB;
        switch (sortBy) {
          case "percentageChange": valueA = a.percentageChange; valueB = b.percentageChange; break;
          case "capitalMarketLastTradedPrice": valueA = a.capitalMarketLastTradedPrice; valueB = b.capitalMarketLastTradedPrice; break;
          case "futuresLastTradedPrice": valueA = a.futuresLastTradedPrice; valueB = b.futuresLastTradedPrice; break;
          default: return 0;
        }
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      });
    }
    setFilteredStocks(result);
  };

  return (
    <div className="container">
      <header>
        <h1>Stock Watchlist Lite</h1>
        <div className="controls">
          <SearchBar onSearch={setSearchQuery} />
          <SortMenu onSort={(s, o) => { setSortBy(s); setSortOrder(o); }} />
          <button className="refresh-btn" onClick={loadData} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button>
        </div>
      </header>

      <main>
        {error ? <ErrorState onRetry={loadData} /> :
        loading ? <div className="stock-grid">{[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}</div> :
        <>
          <div className="stock-grid">
            {filteredStocks.map(stock => (
              <StockCard
                key={stock.id}
                stock={stock}
                viewMode={viewMode}
                onCardClick={setSelectedStock}
                onToggleView={() => setViewMode(viewMode === "A" ? "B" : "A")}
              />
            ))}
          </div>
          <StockDrawer stock={selectedStock} isOpen={!!selectedStock} onClose={() => setSelectedStock(null)} />
        </>}
      </main>
    </div>
  );
}

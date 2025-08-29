export const Dashboard = () => {
    const stats = [
      { title: "Total Products", value: 1245, change: "+12%", trend: "up" },
      { title: "Total Users", value: 842, change: "+5%", trend: "up" },
      { title: "Total Orders", value: 356, change: "+23%", trend: "up" },
      { title: "Online Payments", value: 289, change: "+18%", trend: "up" },
      { title: "Cash on Delivery", value: 67, change: "-2%", trend: "down" },
      { title: "New Signups", value: 48, change: "+7%", trend: "up" },
      { title: "Total Revenue", value: "$24,589", change: "+15%", trend: "up" },
      { title: "Delivered Orders", value: 312, change: "+20%", trend: "up" },
      { title: "Cancelled Orders", value: 14, change: "-3%", trend: "down" },
      { title: "Pending Orders", value: 30, change: "+5%", trend: "up" },
    ];
  
    const recentOrders = [
      { id: "#ORD-001", customer: "John Doe", date: "2023-05-15", amount: "$125", status: "Delivered" },
      { id: "#ORD-002", customer: "Jane Smith", date: "2023-05-14", amount: "$89", status: "Processing" },
      { id: "#ORD-003", customer: "Robert Johnson", date: "2023-05-14", amount: "$234", status: "Shipped" },
      { id: "#ORD-004", customer: "Emily Davis", date: "2023-05-13", amount: "$56", status: "Pending" },
      { id: "#ORD-005", customer: "Michael Brown", date: "2023-05-12", amount: "$178", status: "Delivered" },
    ];
  
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-indigo-50 hover:border-indigo-100 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  stat.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-indigo-50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      stat.trend === "up" ? "bg-indigo-500" : "bg-red-400"
                    }`} 
                    style={{ width: `${Math.random() * 70 + 30}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Charts and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart (Placeholder) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-50 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Revenue Overview</h2>
              <select className="text-sm border border-gray-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-200">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <div className="h-64 bg-indigo-50 rounded-lg flex items-center justify-center text-gray-400">
              [Revenue Chart Placeholder]
            </div>
          </div>
  
          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-50">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Recent Orders</h2>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "Delivered" ? "bg-green-100 text-green-800" :
                      order.status === "Processing" ? "bg-yellow-100 text-yellow-800" :
                      order.status === "Shipped" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-md text-sm font-medium transition-colors">
              View All Orders
            </button>
          </div>
        </div>
  
        {/* Order Status Overview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Order Status Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-indigo-600">Pending</p>
              <p className="text-2xl font-bold text-indigo-800">30</p>
              <p className="text-xs text-indigo-500">+5% from last week</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Processing</p>
              <p className="text-2xl font-bold text-blue-800">42</p>
              <p className="text-xs text-blue-500">+12% from last week</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600">Shipped</p>
              <p className="text-2xl font-bold text-purple-800">28</p>
              <p className="text-xs text-purple-500">+8% from last week</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Delivered</p>
              <p className="text-2xl font-bold text-green-800">312</p>
              <p className="text-xs text-green-500">+20% from last week</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
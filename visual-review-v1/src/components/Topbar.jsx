function Topbar() {
  return (
    <div className=" bg-gray-100 h-12 flex items-center px-6 font-black rounded-lg">
      <div className="flex-1">Logo</div>
      <div className="flex-1 text-center">Visual Review</div>
      <div className="flex-1 text-right">Username</div>
    </div>
  );
}

export default Topbar;
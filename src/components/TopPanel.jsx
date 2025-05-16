import React, { useContext } from "react";
import { Context } from "./Context.js";

import SearchPanel from "./SearchPanel.jsx";

function TopPanel() {
  const { searchPanelVisible } = useContext(Context);

  return (
    <div
      id="topPanel"
      className="flex rounded-lg dark:bg-opacity-5 bg-gray-100 p-2"
    >
      {searchPanelVisible ? <SearchPanel /> : null}
    </div>
  );
}

export default TopPanel;

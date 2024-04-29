import FilesPanel from './FilesPanel';
import ToolsPanel from './ToolsPanel';

function LeftPanel() {
  return (
    <div id="leftPanelWrapper" className="grid grid-rows-[auto,auto] h-full overflow-y-scroll gap-2">
      <FilesPanel />
      <ToolsPanel />
    </div>
  );
}

export default LeftPanel;
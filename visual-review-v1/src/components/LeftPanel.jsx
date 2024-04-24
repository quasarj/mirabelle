import FilesPanel from './FilesPanel';
import ToolsPanel from './ToolsPanel';

function LeftPanel() {
  return (
    <div id="leftPanelWrapper" className="w-72 rounded-lg h-full flex flex-col gap-2">
      <FilesPanel />
      <ToolsPanel />
    </div>
  );
}

export default LeftPanel;
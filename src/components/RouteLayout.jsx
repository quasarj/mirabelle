import React from 'react';

function RouteLayout({ header, leftPanel, middlePanel, rightPanel }) {
    // decide grid template based on which panels exist
    const cols = leftPanel
        ? rightPanel
            ? '[200px,1fr,200px]'   // left+middle+right
            : '[200px,1fr]'         // left+middle
        : rightPanel
            ? '[1fr,200px]'           // middle+right
            : '[1fr]';                // just middle

    return (
        <div id="content">
            {header && header}
            <div
                id="main"
                className={`grid h-full grid-cols-${cols} gap-4`}
            >
                {leftPanel && <div id="left-panel">{leftPanel}</div>}
                <div id="middle-panel">{middlePanel}</div>
                {rightPanel && <div id="right-panel">{rightPanel}</div>}
            </div>
        </div >
    );
}

export default RouteLayout;
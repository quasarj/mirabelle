import React, { useState, useEffect, useRef, useContext } from 'react';
import { Context } from './Context.js';
import MiddleTopPanel from './MiddleTopPanel.jsx';
import ViewPanel from './ViewPanel.jsx';
import { getFiles, getIECInfo } from '../utilities.js';

function MiddlePanel({ files, iecs, iec }) {

    const { leftPanelVisible, setLeftPanelVisible, rightPanelVisible, setRightPanelVisible } = useContext(Context);

    const [realFiles, setRealFiles] = useState([]);
    const [iecOffset, setIecOffset] = useState(0);
    const [volumeName, setVolumeName] = useState(0);

    useEffect(() => {
        const doTheThing = async () => {

            // console.log(">>> MiddlePanel useEffect firing, iecOffset=", iecOffset);
            // console.log("files=", files, "iec=", iec);
            if (files === undefined) {

                const iecfiles = await getFiles(iecs[iecOffset]);
                setRealFiles(iecfiles);
                setVolumeName(iecs[iecOffset]);
            } else {
                setRealFiles(files);
            }
        };

        doTheThing();
    }, [iecs, iecOffset]);

    return (
        <div id="middlePanel" className="relative w-full rounded-lg border-4 border-blue-500 p-2 flex flex-col gap-2">

            {/*<MiddleTopPanel iecs={iecs} onIecChange={setIecOffset}/>*/}
            <ViewPanel files={realFiles} volumeName={volumeName} iec={iec} />

        </div>
    );
}

export default MiddlePanel;

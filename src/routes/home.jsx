import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const iecExamples = [
    1,
    2,
    3,
    98738,
    98739,
    98740,
    98742,
    98745,
    98746,
    98748,
  ];

  return (
	  <div>
	  <h1>Welcome</h1>
	  
	  <ul>
      {iecExamples.map((iec) => (
        <li>
            <Link to={`/mask/iec/${iec}`}>{iec}</Link>
        </li>
      ))}

      <li>
          <Link to={`/mask/iec/3`}>Example Mask IEC</Link>
      </li>
      <li>
          <Link to={`/mask/vr/1`}>Example Mask VR</Link>
      </li>
	  </ul>


	  </div>
  );
}

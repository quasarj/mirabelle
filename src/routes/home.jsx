import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
	  <div>
	  <h1>Welcome</h1>
	  
	  <ul>
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


import React, { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';

import { Context } from '@/components/Context';
import Header from '@/components/Header';
import { useDispatch } from 'react-redux';
import { setTitle } from '@/features/presentationSlice';

import './home.css';

export default function Home() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(setTitle('Home'));  // <-- set the title on mount
  }, [dispatch]);

  const iecExamples = {
    "A torso and a sliver": 1,
    "A nice torso": 2,
    "A grotesque abomination": 3,
    "A head and a tennis racket": 98738,
    "A perfect head": 98739,
    "A full body (man)": 98740,
    "A face without the top of the head": 98742,
    "A second full body (same man?)": 98745,
    "A third full body (woman, with glasses)": 98746,
    "Extremely large full body (man)": 98748,
  };

  const ProdIecExamples = {
    "CT - AXIAL - 1.3.6.1.4.1.14519.5.2.1.186848473283379477869709168257845339904:6994 - 1117963": 1117963,
    "CT - AXIAL - 1.3.6.1.4.1.14519.5.2.1.3320.3273.193828570195012288011029757668:6994 - 1117964": 1117964,
    "CT - AXIAL - 1.3.6.1.4.1.14519.5.2.1.1610.1211.288190221937530030445669621012:6994 - 1117940": 1117940,
    "CT - AXIAL - 1.3.6.1.4.1.14519.5.2.1.7009.2405.207727460862016708992675978757:6994 - 1117950 - 0": 1117950,
    "CT - AXIAL - 1.3.6.1.4.1.14519.5.2.1.3320.3470.255277769016136597927917157845:6994 - 1117939 - 4": 1117939,
    "CT - AXIAL - 1.3.6.1.4.1.14519.5.2.1.75166052413070455086490269915373950396:6994 - 1117957 - 3": 1117957,
    "CT - AXIAL - 1.3.6.1.4.1.14519.5.2.1.1600.1205.316230080954982522655149424809:6994 - 1117951": 1117951,
    "CT - AXIAL - 1.3.6.1.4.1.14519.5.2.1.1600.1205.419406386368901680403760978291:6994 - 1117973": 1117973,
    "CT - AXIAL - 1.3.6.1.4.1.14519.5.2.1.1600.1205.188445114430569937879113665540:6994 - 1117932": 1117932,
    "CT - AXIAL - 1.3.6.1.4.1.14519.5.2.1.1600.1207.213528417283901919859603320290:6994 - 1117934": 1117934,

    "MR - AXIAL - 1.3.6.1.4.1.14519.5.2.1.1600.1207.121336413358493861988489062638:6994 - 1117948": 1117948,
    "MR - AXIAL - 1.3.6.1.4.1.14519.5.2.1.1600.1207.309069710700921874157613369082:6994 - 1117962": 1117962,
    "MR - AXIAL - 1.3.6.1.4.1.14519.5.2.1.1600.1207.205470776131083542748884183220:6994 - 1117965": 1117965,

    "PT - AXIAL - 1.3.6.1.4.1.14519.5.2.1.323750038616594282169547005232663728089:6994 - 1117931": 1117931,
    "PT - AXIAL - 1.3.6.1.4.1.14519.5.2.1.36047274504731896722218836378131997846:6994 - 1117969": 1117969,
    "PT - AXIAL - 1.3.6.1.4.1.14519.5.2.1.175890278148878062049681622711277043728:6994 - 1117953": 1117953,


    "MR - CORONAL - 1.3.6.1.4.1.14519.5.2.1.1600.1203.316514787301534789529776494057:6994 - 1117936": 1117936,
    "MR - CORONAL - 1.3.6.1.4.1.14519.5.2.1.1600.1203.431498397378244823983229662412:6994 - 1117949": 1117949,
    "MR - CORONAL - 1.3.6.1.4.1.14519.5.2.1.1600.1203.160203926852647208081609618720:6994 - 1117938": 1117938,

    "PT - CORONAL - 1.3.6.1.4.1.14519.5.2.1.1600.1207.261535963948319190648296897961:6994 - 1117956": 1117956,
    "PT - CORONAL - 1.3.6.1.4.1.14519.5.2.1.1600.1207.321519408480458501979755682546:6994 - 1117933": 1117933,


    "CT - SAGITTAL - 1.3.6.1.4.1.14519.5.2.1.1600.1202.186600888426518995732373154513:6994 - 1117959": 1117959,
    "CT - SAGITTAL - 1.3.6.1.4.1.14519.5.2.1.1600.1207.236352681751614387098506251217:6994 - 1117972": 1117972,
    "CT - SAGITTAL - 1.3.6.1.4.1.14519.5.2.1.1600.1207.207364679267050734194150279795:6994 - 1117961": 1117961,
    "CT - SAGITTAL - 1.3.6.1.4.1.14519.5.2.1.1600.1206.239190725826528812824420431561:6994 - 1117945 - 9": 1117945,
    "CT - SAGITTAL - 1.3.6.1.4.1.14519.5.2.1.1600.1207.236078584756428916751961334379:6994 - 1117955 - 10": 1117955,

    "MR - SAGITTAL - 1.3.6.1.4.1.14519.5.2.1.196605722926987349872646063186293135580:6994 - 1117952": 1117952,
    "MR - SAGITTAL - 1.3.6.1.4.1.14519.5.2.1.1600.1206.301323203034319921509932891178:6994 - 1117974": 1117974,
    "MR - SAGITTAL - 1.3.6.1.4.1.14519.5.2.1.1600.1202.119865647617160675589222281582:6994 - 1117960": 1117960,

    "PT - SAGITTAL - 1.3.6.1.4.1.14519.5.2.1.1600.1205.662318764541682025757456434883:6994 - 1117970": 1117970,
    "PT - SAGITTAL - 1.3.6.1.4.1.14519.5.2.1.1600.1207.126127841421966420153750546982:6994 - 1117946": 1117946,
    "PT - SAGITTAL - 1.3.6.1.4.1.14519.5.2.1.1600.1207.316360555850694001566125573676:6994 - 1117947": 1117947,

  };

  return (
    <Context.Provider value={{ title: "Home Page", template: "" }}>
      <div id="RouteHome">
        <p>
          This is a dev/testing page with links to a number of
          examples.
        </p>
        <h2>Examples of all routes</h2>
        <ul>
          <li>Masking</li>
          <li>
            <Link to="/mask/iec/1117950">Mask IEC (volume)</Link>
          </li>
          <li>
            <Link to="/mask/iec/1167702">Mask IEC (stack)</Link>
          </li>
          <li>
            <Link to="/mask/vr/1336">Mask VR</Link>
          </li>

          <li>Masking Review</li>
          <li>
            <Link to="/mask/review/iec/1117950">Mask Review IEC (volume)</Link>
          </li>
          <li>
            <Link to="/mask/review/iec/1167702">Mask Review IEC (stack)</Link>
          </li>
          <li>
            <Link to="/mask/review/vr/1336">Mask Review VR</Link>
          </li>

          <li>DICOM Visual Review</li>
          <li>
            <Link to="/review/dicom/iec/1117950">DICOM Review IEC (volume)</Link>
          </li>
          <li>
            <Link to="/review/dicom/iec/1167702">DICOM Review IEC (stack)</Link>
          </li>
          <li>
            <Link to="/review/dicom/vr/1515">DICOM Review VR</Link>
          </li>

          <li>Nifti Visual Review</li>
          <li>
            <Link to="/review/nifti/file/155149761">Nifti Review File</Link>
          </li>
          <li>
            <Link to="/review/nifti/vr/1">Nifti Review VR</Link>
          </li>

        </ul>

        <hr />
        <h2>All examples below this point are Masking</h2>
        <h2>Examples (all direct IECs)</h2>
        <ul>
          {Object.entries(iecExamples).map((entry) => (
            <li>
              <Link to={`/mask/iec/${entry[1]}`}>{entry[0]}</Link>
            </li>
          ))}
        </ul>
        <br />
        <h2>Old example links</h2>
        <ul>
          <li>
            <Link to={`/mask/iec/3`}>Example Mask IEC</Link>
          </li>
          <li>
            <Link to={`/mask/vr/1336`}>Example Mask VR</Link>
          </li>
        </ul>
        <br />
        <h2>Prod example links</h2>
        <ul>
          {Object.entries(ProdIecExamples).map((entry) => (
            <li>
              <Link to={`/mask/iec/${entry[1]}`}>{entry[0]}</Link>
            </li>
          ))}
        </ul>

      </div>
    </Context.Provider>
  );
}

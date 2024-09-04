import { Image, Table } from "react-bootstrap";
import logoImage from "../assets/logo.png";
import { colorTransparente } from "../utils/colorTemplate";

const styleTable = {
    border: 'none',
    backgroundColor: colorTransparente
};

const Footer = () => {
    return (
        <div style={{backgroundColor: '#8306AD', padding: '2% 7%', width: '100%', height: 'auto', justifyContent: 'space-between', alignItems: 'center', borderRadius: '50px 50px 0 0', display: 'flex'}}>
            <Table style={{borderCollapse: 'collapse', width: '100%', styleTable, color: 'white'}}>
                <thead>
                    <tr style={styleTable}>
                    <th style={styleTable}>
                        <Image src={logoImage} className="img-fluid" style={{ width: "80px", height: "80px"}} />
                        Taskeria
                    </th>
                    <th style={styleTable}></th>
                    <th style={styleTable}></th>
                    <th style={styleTable}></th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={styleTable}>
                    <td style={styleTable}></td>
                    <td style={styleTable}></td>
                    <td style={styleTable}></td>
                    <td style={styleTable}></td>
                    </tr>
                    <tr style={styleTable}>
                    <td style={styleTable}></td>
                    <td style={styleTable}></td>
                    <td style={styleTable}></td>
                    <td style={styleTable}></td>
                    </tr>
                    <tr style={styleTable}>
                    <td style={styleTable}></td>
                    <td style={styleTable}></td>
                    <td style={styleTable}></td>
                    <td style={styleTable}>hola</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}

export default Footer;
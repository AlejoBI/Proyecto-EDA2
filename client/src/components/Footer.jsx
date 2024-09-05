import { Image, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import logoImage from "../assets/logo.png";
import { colorTransparente } from "../utils/colorTemplate";

const styleTable = {
    border: 'none',
    backgroundColor: colorTransparente,
    color: 'white',
    fontSize: '14px'
};

const styleTable2 = {
    textDecoration: 'none',
    color: 'white'
}

const Footer = () => {
    return (
        <>
            <div style={{color: 'white', backgroundColor: '#8306AD', width: '100%', height: 'auto', justifyContent: 'space-between', borderRadius: '50px 50px 0 0', display: 'flex', flexDirection: 'column'}}>
                <div style={{padding: '2% 7%'}}>
                <Table style={{borderCollapse: 'collapse', width: '100%', styleTable}}>
                        <thead>
                            <tr style={styleTable}>
                            <th style={styleTable}>
                                <Image src={logoImage} className="img-fluid" style={{ width: "80px", height: "80px"}} />
                                Taskeria
                            </th>
                            <th style={styleTable}>Categories</th>
                            <th style={styleTable}>Help</th>
                            <th style={styleTable}>Community</th>
                            <th style={styleTable}>Company</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={styleTable}>
                            <td style={styleTable}></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>Technology and Programming</Link></td>
                            <td style={styleTable}><Link to="/login" style={styleTable2}>Help and Support</Link></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>Academy</Link></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>About Us</Link></td>
                            </tr>
                            <tr style={styleTable}>
                            <td style={styleTable}></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>Graphic Design</Link></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>Trust and Security</Link></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>Blog</Link></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>Careers</Link></td>
                            </tr>
                            <tr style={styleTable}>
                            <td style={styleTable}></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>Video and Animation</Link></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>Quality Guide</Link></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>Themes</Link></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>FAQs</Link></td>
                            </tr>
                            <tr style={styleTable}>
                            <td style={styleTable}></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>Writing and Translation</Link></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>Taskeria Guides</Link></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>Hosting</Link></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>Teams</Link></td>
                            </tr>
                            <tr style={styleTable}>
                            <td style={styleTable}></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>Digital Marketing</Link></td>
                            <td style={styleTable}></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>Developers</Link></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>Contact Us</Link></td>
                            </tr>
                            <tr style={styleTable}>
                            <td style={styleTable}></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>Music and Audio</Link></td>
                            <td style={styleTable}></td>
                            <td style={styleTable}><Link to="/register" style={styleTable2}>Support</Link></td>
                            <td style={styleTable}></td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', marginTop: '20px', margin: '0 1%', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'start'}}>
                        <p style={{padding: '15px'}}>Privacy Policy</p>
                        <p style={{padding: '15px'}}>Terms of Use</p>
                        <p style={{padding: '15px'}}>Sales and Refunds</p>
                        <p style={{padding: '15px'}}>Legal</p>
                    </div>
                    <div style={{justifyContent: 'end'}}>
                        <p style={{padding: '15px'}}>© 2024 Taskeria. All rights reserved</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Footer;
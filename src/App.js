import { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

import 'font-awesome/css/font-awesome.min.css';
import { InputGroup } from "react-bootstrap"

function App() {
  
  const [countryInf, setcountryInf] = useState("1");

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true) 
  
  const [mdTitle, setMdTitle] = useState("Title");
  const [mdBody, setMdBody] = useState("Body");

  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(false)
  
  const [search,setSearch]=useState('');
    
  const [order,setOrder]=useState("ASC");  
  const sorting=col=>{
    if(order==="ASC"){
      setOrder("DSC");
    }
    if(order==="DSC"){
      setOrder("ASC");
    }
  } 

  useEffect(() => {
    setLoading(true)
    fetch("https://restcountries.com/v3.1/all")
      .then(response => response.json())
      .then(json => setCountries(json))
      .finally(() => {
        setLoading(false)
      })
  }, []) 
   
  const [TotalRecord,setTotalrecord]=useState(0);
  const [currentPage,setCurrentPage]=useState(1)
  const recordsPerPage=25;
  const lastIndex=currentPage*recordsPerPage
  const firstIndex=lastIndex-recordsPerPage
  const records=countries.slice(firstIndex,lastIndex)
  //const records=records.slice(firstIndex,lastIndex)

  const npage=Math.ceil(countries.length/recordsPerPage)  
  const numbers=[...Array(10-1).keys()].slice(1) 
  
  function countryInfShow(pp)
  {
    let msg="N/A";
    let MsgTitle="";
    
    let MsgBody="N/A";

    let countryOjb = {};

    countries?.map((n,i) => (              
      //Total=i+1
      n.ccn3 == pp) ?  countryOjb = 
        {Id: n.ccn3,Common:n.common, official: n.name.official ,SC: 50, ShortCut: n.cca3, Region:n.region, population:n.population} 
        : ""
    )
    
    MsgTitle=countryOjb.official+ "- Id: "+countryOjb.Id;
    MsgBody="Country Name: "+ countryOjb.official + 
    " ("+countryOjb.Id+") " +", SC: " +countryOjb.SC+
    " ("+countryOjb.Id+") " +", ShortCut: " +countryOjb.ShortCut+
    ", Region: " +countryOjb.Region + ", Population: "+countryOjb.population;

    setMdTitle(MsgTitle);
    setMdBody(MsgBody);
    handleShow();  

    setcountryInf(msg);
  }

  function searchFunction(e)
  {
    setTotalrecord(records.length);
    setSearch(e);
  }

  // function imgPath(imgName)
  // {
  //   let Path="https://flagcdn.com/w320/"+imgName+".png";
  //   return Path;
  // }

  function prePage()
  {
    if(currentPage!==firstIndex && currentPage>1){
      setCurrentPage(currentPage-1)
    }       
  }  
  function changPage(id)
  {
    setCurrentPage(id)
  }
  function nextPage()
  {
    if(currentPage!==lastIndex && currentPage<npage)
    {
      setCurrentPage(currentPage+1)
    }
  }
  function checkNativeName(nativeNameObject)
  {
    let msg="";
    if(nativeNameObject!=null)
    {      
        Object.keys(nativeNameObject).map((key) => 
        {
          msg= msg + key +", " ;
        })
      msg=msg.slice(0, -2);
    }
    else{
      msg="n/a";
    }
      return msg;
  }
  
  // console.log(search)
  return ( 
     
    <div className="container">      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h3>Countries Catalog </h3>
          <div> Total Record: {countries.length} - Record per page: {npage}  / Page: ({npage}) / CurrentPage: {currentPage} / FIndex: {firstIndex} - LIndex: {lastIndex}</div>
          <div class="d-flex justify-content-between bg-light">
            <div >
              {/* <div>Test: {countryInf}</div> 
              <button className="btn btn-primary" onClick={()=>countryInfShow(663)}>663 </button> */}
            </div>
            <div>
              <Form>
                <InputGroup className="my-3 px-3">
                  <Form.Control 
                  onChange={(e)=>searchFunction(e.target.value)}
                  placeholder='Search Country Name'>
                  </Form.Control>
                </InputGroup>
              </Form>
            </div>
          </div>
          <table className="table table-bordered table-striped">
            <thead>
            <tr className="table-primary">
              <th className="align-text-top">Flag</th>
              <th className="align-text-top">
                <div className="row">
                  <div class="d-flex justify-content-between w-100">
                      <div className="smalls">
                        Country Name ({order})
                      </div>
                      <div>
                        <button className="btn btn-link p-0" onClick={()=>sorting("FieldName")}>
                          <i class="fa fa-fw fa-sort"></i>
                        </button>
                      </div>
                    </div>
                </div>              
              </th>
              <th className="align-text-top">
                <div className="row">
                  <div>2 Character </div>
                  <div>Country Code</div>
                </div>                 
              </th>
              <th className="align-text-top"><div className="row">
                  <div>3 Character </div>
                  <div>Country Code</div>
                </div> 
              </th>

              <th className="align-text-top">
                <div className="row">
                  <div>Native </div>
                  <div>Country Name</div>
                </div>
              </th>
              <th className="align-text-top">
                <div className="row">
                  <div>Alternative</div>
                  <div>Country Name</div>
                </div>
              </th>
              <th className="align-text-top">Country Calling Codes</th>
            </tr>
            </thead>
            <tbody>
            {
              records?.
              sort((a, b) => (a.name.official.toLowerCase() > b.name.official.toLowerCase() ? 1 : -1)).
              filter((country)=>{
                return search.toLowerCase()===''
                  ? country :
                  country.name.official.toLowerCase().includes(search)
                  }).map((country,index) => (

                <tr key={country.id}>
                  <td><img src={`https://flagcdn.com/w320/${country.cca2.toLowerCase()}.png`} width={60}></img></td>
                  <td>
                    <div onClick={() => countryInfShow(country.ccn3)}> {country.name.official} </div>
                  </td>
                  <td>{country.cca2}</td>
                  <td>{country.cca3}</td>                
                  <td>
                    <div>                        
                      {
                        checkNativeName(country.name.nativeName)                        
                      }
                    </div>
                  </td>                
                  <td>
                    <div className="row">
                      {
                        Object.keys(country.altSpellings).map(key => (
                            <div value={key}>{country.altSpellings[key]}</div>
                        ))
                        // <p>n/a</p>
                      }                   
                    </div>
                  </td>
                  <td>{country.idd.root}</td>
                </tr>
              ))
            }
            </tbody>            
          </table>
          <nav>
            <ul className="pagination">
                    <li className='page-item'>
                      <a className="page-link" onClick={prePage}>Prev</a>
                    </li>
                    {                      
                      numbers?.map((n,i) => (              
                        <li className={`page-item ${currentPage===n?'active':''}` } key={i}>
                          <a className="page-link" 
                              onClick={()=>changPage(n)}>{n}</a>
                        </li>
                      ))
                    }
                    <li className='page-item'>
                      <a className="page-link" onClick={()=>nextPage()}>Next</a>
                    </li>               
            </ul>
          </nav>
        </>
      )}

      <Modal show={show}  size="lg" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{mdTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{mdBody}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>         
        </Modal.Footer>
      </Modal>                   
    </div>
  ) 
  
}

export default App
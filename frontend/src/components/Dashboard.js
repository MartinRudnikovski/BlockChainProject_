import {useState} from "react";
import CVExplorerJSON from '../CVExplorer.json';
import Web3 from "web3";


const Dashboard = () => {

    const [account, setAccount] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [numberOfCVs, setNumberOfCVs] = useState(null);
    const [CVs, setCVs] = useState(null);


    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [age, setAge] = useState(18);
    const [location, setLocation] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [experiences, setExperiences] = useState('');
    const [contactInfo, setContactInfo] = useState('');

    let web3 = null;
    let CVExplorerContract = null;

    const connectWallet = async () => {
        if (window.ethereum) {
            await window.ethereum.request({method: 'eth_requestAccounts'})
                .then( async (result) => {
                    await accountChangedHandler(result[0]);
                });
        }
        else {
            setErrorMessage('Install MetaMask!');
        }
    }

    class CVModel{
        constructor(id, name, surname, age, location, contactInformation, jobTitle, experiences) {
            this.id = id;
            this.name = name;
            this.surname = surname;
            this.age = age;
            this.location = location;
            this.contactInformation = contactInformation;
            this.jobTitle = jobTitle;
            this.experiences = experiences;
        }
    }

    const doneHandler = async () => {
        web3 = new Web3(window.ethereum);
        CVExplorerContract = new web3.eth.Contract(CVExplorerJSON.abi, '0x2988BdaB10ecB22F676f5bfe37B01FC37b1333f5');

        try {
            const temp = await CVExplorerContract.methods.saveCV(
                name,
                surname,
                age.valueOf(),
                location,
                contactInfo,
                jobTitle,
                experiences
            ).send({ from: account});

            window.location.reload();

        }
        catch (err){
            alert(err)
        }


    }

    const accountChangedHandler = async (newAccount) => {
        setAccount(newAccount);
        web3 = new Web3(window.ethereum);
        CVExplorerContract = new web3.eth.Contract(CVExplorerJSON.abi, '0x2988BdaB10ecB22F676f5bfe37B01FC37b1333f5');
        let num = await CVExplorerContract.methods.numberOfCVs(newAccount).call({
            from: newAccount
        });
        setNumberOfCVs(num);


        const cvs = [];
        for(let i = 0; i<num; i++){
            const  {zero, one,two, three, four, five, six, seven,
                id, name, surname, age, location, contactInformation, jobTitle, experiences}
                = await CVExplorerContract.methods.userCVs(newAccount, i).call({
                from: newAccount
            }).then();

            const cv = new CVModel(
                id,
                name,
                surname,
                age,
                location,
                contactInformation,
                jobTitle,
                experiences
            );

            cvs.push(cv);
        }
        setCVs(cvs);
    }

    const handleDeleteCV = async (id) => {
        web3 = new Web3(window.ethereum);
        CVExplorerContract = new web3.eth.Contract(CVExplorerJSON.abi, '0x2988BdaB10ecB22F676f5bfe37B01FC37b1333f5');
        try {
            await CVExplorerContract.methods.deleteCV(id).send({from: account});
            window.location.reload();
        }
        catch (err){
            alert(err);
        }

    }

    const handleDeleteAllCV = async () => {
        web3 = new Web3(window.ethereum);
        CVExplorerContract = new web3.eth.Contract(CVExplorerJSON.abi, '0x2988BdaB10ecB22F676f5bfe37B01FC37b1333f5');
        try {
            await CVExplorerContract.methods.deleteAllCVs().send({from: account});
            window.location.reload();
        }
        catch (err){
            alert(err);
        }
    }


    window.ethereum.on('accountsChanged', accountChangedHandler);


    return (
        <div className='row mt-3'>

            <div className='container col'>
                <h1>CV Explorer</h1>
                <div className=''>

                    <p>{account === null ? 'Not connected to MetaMask.' : 'Account: ' + account}</p>
                    {account === null ? (<button onClick={connectWallet}>Connect to MetaMask</button>) : ''}
                </div>

                <div className='col'>

                </div>
                <div className='col'>
                    {
                        account === null ? '' : (
                            <div>
                                <div className='row'>
                                    <div className='col'>
                                        <p>Number of CVs: {numberOfCVs}</p>
                                    </div>
                                    <div className='col'>
                                        <button className='btn btn-danger' onClick={handleDeleteAllCV}>Delete all of your CVs</button>
                                    </div>
                                </div>

                                <div>
                                    {   CVs === null ? '' :
                                        CVs.map(cv =>
                                            <div className="card bg-white mb-2">
                                                <div className="card-body text-dark">
                                                    <ul className='list-group list-group-flush'>
                                                        <li className='list-group-item'>Name and Surname: {cv.name + ' ' + cv.surname}</li>
                                                        <li className='list-group-item'>Age: {cv.age}</li>
                                                        <li className='list-group-item'>Location: {cv.location}</li>
                                                        <li className='list-group-item'>Contact information: {cv.contactInformation}</li>
                                                        <li className='list-group-item'>Job title: {cv.jobTitle}</li>
                                                        <li className='list-group-item'>Experiences: {cv.experiences}</li>
                                                    </ul>
                                                    <hr className='hr'/>
                                                    <button className='btn btn-danger' onClick={() => handleDeleteCV(cv.id)}>Delete CV</button>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className='col'>
                {
                    account === null ? '' :
                    <form>
                        <div className="form-group mb-1">
                            <input type="text" className="form-control" id="name" placeholder="Name" onChange={_ => setName(_.target.value)}/>
                        </div>
                        <div className="form-group mb-1">
                            <input type="text" className="form-control" id="surname" placeholder="Surname" onChange={_ => setSurname(_.target.value)}/>
                        </div>
                        <div className="form-group mb-1">
                            <input type="number" className="form-control" id="age" placeholder="Age" onChange={_ => setAge(_.target.value)}/>
                        </div>
                        <div className="form-group mb-1">
                            <input type="text" className="form-control" id="location" placeholder="Location" onChange={_ => setLocation(_.target.value)}/>
                        </div>
                        <div className="form-group mb-1">
                            <input type="text" className="form-control" id="jobTitle" placeholder="Job title" onChange={_ => setJobTitle(_.target.value)}/>
                        </div>
                        <div className="form-group mb-1">
                            <textarea className="form-control" id="contact information" rows="3" placeholder='Contact information' onChange={_ => setContactInfo(_.target.value)}></textarea>
                        </div>

                        <div className="form-group mb-1">
                            <textarea className="form-control" id="experiences" rows="3" placeholder='Experiences' onChange={_ => setExperiences(_.target.value)}></textarea>
                        </div>

                        <div>
                            <small className='form-text text-muted'>
                                This information is going on the blockchain.
                            </small>
                        </div>
                        <button type='button' className="btn btn-info" onClick={doneHandler}>Done</button>
                    </form>
                }

            </div>

        </div>
    );
}

export default Dashboard;
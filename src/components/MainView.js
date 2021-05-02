import React, {useState, useRef} from "react";


const MainView = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [type, setType] = useState(" ");
    const [pesel, setPesel] = useState(" ");
    const [nip, setNip] = useState(" ");
    const [selectedFile, setSelectedFile] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const errorMsg = validate(pesel, nip)
        if (errorMsg) {
            setError(errorMsg);
            console.log("błędna walidacja")
        }
        const clients = {name, surname, type, pesel, nip, selectedFile};
        setIsPending(true);
        fetch("https://localhost:60001/Contractor/Save", {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(clients)
        }).then(response => {
            if (!response.ok) {
                throw Error()
            }
        }).then(response => {
            console.log(response);
            setIsPending(false);
        }).catch(error => {
            console.error(error);
            setError("Nie znaleziono metody zapisu!")
        })
    }
    return (
        <div className="main-container">
            <h1 className="new-client">Dodawanie kontrahenta</h1>
            <form className="main-form" onSubmit={handleSubmit}>
                <label className="input-label">Imię:</label>
                <input
                    className="input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label className="input-label">Nazwisko:</label>
                <input
                    className="input"
                    type="text"
                    required
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                />
                <label className="input-label">Typ:</label>
                <select
                    className="input"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="osoba">Osoba</option>
                    <option value="firma">Firma</option>
                </select>
                {type !== "firma" ? <div className="internal-container">
                        <label className="input-label">Pesel:</label>
                        <input
                            className="input"
                            type="number"
                            required
                            value={pesel}
                            onChange={(e) => setPesel(parseInt(e.target.value))}/></div>

                    : <div className="internal-container"><label className="input-label">NIP:</label>
                        <input
                            className="input"
                            type="number"
                            required
                            value={nip}
                            onChange={(e) => setNip(parseInt(e.target.value))}/></div>
                }
                <label className="input-label" htmlFor="img">Dodaj swoje zdjęcie:</label>
                <FileUploader
                    onFileSelect={(file) => setSelectedFile(file)}
                />

                {!isPending && <button className="button">Dodaj kontrahenta</button>}
                {isPending && <button className="button" disabled> Dodawanie kontrahenta...</button>}
                <h3 className="error">{error}</h3>
            </form>
        </div>
    )
}
const validate = (pesel, nip) => {
    if (pesel.length < 11) {
        return "podany pesel jest za krótki!"
    } else if (pesel.length > 11) {
        return "podany pesel jest za długi!"
    }

    if (nip.length < 10) {
        return "podany nip jest za krótki!"
    } else if (nip.length > 10) {
        return "podany nip jest za długi!"

    }
    return null;
}
const FileUploader = ({onFileSelect}) => {
    const fileInput = useRef(null)
    const [uploadedImg, setUploadedImg] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')
    const handleFileInput = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setUploadedImg(reader.result)
            }
        }
        const file = e.target.files[0];
        onFileSelect(file);
        console.log(uploadedImg);

    }
    return (

        <div className="img-container">

            <input ref={fileInput} type="file" accept="image/jpeg" id="input" onChange={handleFileInput}/>
            <button onClick={(e) => fileInput.current && fileInput.current.click()} className="button">Dodaj</button>
            <div className="img-holder">
                <img className="img-uploaded" src={uploadedImg} alt="" id="img"/>
            </div>
        </div>)
}

export default MainView;
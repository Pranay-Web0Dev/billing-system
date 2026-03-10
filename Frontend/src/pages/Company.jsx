import React, { useState, useEffect } from 'react';
import './css/company.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../componentes/Navbar';
import Swal from 'sweetalert2';

const Company = () => {
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [Address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [isCompanyDataAvailable, setIsCompanyDataAvailable] = useState(false);
    const [data, setData] = useState([]);
    const [id, setId] = useState('');
    const [file, setFile] = useState('')
    // console.log(file)

    const navigate = useNavigate();

    // ------------------- THE ADD API
    const handleAddCompany = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('companyName', companyName);
        formData.append('email', email);
        formData.append('Address', Address);
        formData.append('phone', phone);
        formData.append('logo', file); // Assuming `logo` is the image file you want to upload

        try {
            await toast.promise(
                fetch("https://billing-system-sno9.onrender.com/api/company/add", {
                    method: "POST",
                    body: formData
                }).then(response => {
                    if (response.ok) {
                        setIsCompanyDataAvailable(true);
                        showAllDetails();
                        return response.json();
                    } else {
                        throw new Error("Failed to add company. Please provide all data.");
                    }
                }),
                {
                    pending: 'Adding company data...',
                    success: 'Company Data Added successfully!',
                    error: 'An error occurred while adding company data.'
                }
            );
        } catch (error) {
            // console.log("Error adding company:", error);
            toast.error("An error occurred while adding company data.");
        }
    };


    // -------------- FETCHING THE COMPANY DATA -------------

    const showAllDetails = async () => {
        try {
            const response = await fetch('https://billing-system-sno9.onrender.com/api/company/get', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            if (response.ok) {
                const result = await response.json();
                setData(result);
                if (result.length > 0) {
                    const firstCompany = result[0];
                    setId(firstCompany._id);
                    setCompanyName(firstCompany.companyName);
                    setAddress(firstCompany.Address);
                    setEmail(firstCompany.email);
                    setPhone(firstCompany.phone);
                    setFile(firstCompany.logo)
                    setIsCompanyDataAvailable(true);
                } else {
                    setIsCompanyDataAvailable(false);
                    // console.log("No company data found.");
                }
            } else {
                setIsCompanyDataAvailable(false);
                // console.log("Failed to fetch company data.");
            }
        } catch (error) {
            setIsCompanyDataAvailable(false);
            console.error('Error sending data:', error);
            toast.error('An error occurred while sending data');
        }
    };

    useEffect(() => {
        showAllDetails();
    }, []);



    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('companyName', companyName);
        formData.append('email', email);
        formData.append('address', Address);
        formData.append('phone', phone);
        formData.append('logo', file);

        try {
            await toast.promise(
                fetch(`https://billing-system-sno9.onrender.com/api/company/update/${id}`, {
                    method: "PUT",
                    body: formData
                }).then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Failed to update company');
                    }
                }),
                {
                    pending: 'Updating company information...',
                    success: 'Company information updated successfully!',
                    error: 'An error occurred while updating the company'
                }
            );
        } catch (error) {
            console.error("Error updating company:", error);
            toast.error('An error occurred while updating the company');
        }
    };



    return (
        <>
            <Navbar />
            <section id="company_home">
                <div className="form">
                    <div className="side1">
                        <h1>Company Details</h1>
                        <form onSubmit={isCompanyDataAvailable ? handleUpdate : handleAddCompany}>
                            <label htmlFor="file">Upload Logo</label>
                            <div className='logo_field'>
                                <input
                                    type="file"
                                    placeholder='Name'
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                                <img src={file} alt="uplode logo" />
                            </div>
                            <input
                                type="text"
                                placeholder='Name'
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder='Phone No'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder='Address'
                                value={Address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <div className="btns">
                                <button type="submit" className='company_btn'>
                                    {isCompanyDataAvailable ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Company;

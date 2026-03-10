import React from 'react'
import './css/productpage.css'
import Navbar from '../componentes/Navbar'

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';


import { XCircle, Pen, Truck, Trash2 } from 'lucide-react'
import Quagga from 'quagga'


function ProductPage() {
    const [products, setProducts] = useState([])
    const [productName, setproductName] = useState("")
    const [category, setCategory] = useState("")
    const [quantity, setquantity] = useState("")
    const [saleprice, setSetsalePrice] = useState("")
    const [purchasePrice, setpurchasePrice] = useState("")
    const [totalPurchase, setTotalPurchase] = useState("")
    const [search, setSearch] = useState("")
    const [unit, setUnit] = useState('')
    const [totalProdcuts, setTotalProducts] = useState(0)

    const [scanning, setScanning] = useState(false);
    const [isQuaggaStarted, setIsQuaggaStarted] = useState(false);
    const [barcode, setBarcode] = useState('');

    const startScanning = () => {
        if (!isQuaggaStarted) {
            setScanning(true);

            Quagga.init(
                {
                    inputStream: {
                        type: 'LiveStream',
                        target: document.querySelector('#scanner'),
                        constraints: {
                            facingMode: 'environment' // Rear camera if available
                        }
                    },
                    decoder: {
                        readers: ['ean_reader']
                    }
                },
                (err) => {
                    if (err) {
                        console.error('Error starting Quagga:', err);
                        setScanning(false);
                        return;
                    }

                    Quagga.start();
                    setIsQuaggaStarted(true);

                    Quagga.offDetected(handleBarcodeDetected);
                    Quagga.onDetected(handleBarcodeDetected);
                }
            );
        }
    };

    const handleBarcodeDetected = (data) => {
        const scannedData = data.codeResult.code;
        setBarcode(scannedData);

        stopScanning();
    };

    const stopScanning = () => {
        if (isQuaggaStarted) {
            Quagga.offDetected(handleBarcodeDetected);
            Quagga.stop();
            setIsQuaggaStarted(false);
            setScanning(false);
        }
    };

    // Ensure Quagga stops on unmount to release camera resources
    useEffect(() => {
        return () => {
            stopScanning();
        };
    }, []);

    const stopScanner = (e) => {
        e.preventDefault()
        if (isQuaggaStarted) {
            Quagga.offDetected(handleBarcodeDetected); // Remove listener to avoid duplicates
            Quagga.stop(); // Stop the camera and scanning process
            setIsQuaggaStarted(false); // Reset the Quagga started state
            setScanning(false); // Reset scanning state
        }
    };




    // ------------- FETCHING ALL AVALIABLE PRODUCTS -------------------

    const showAllproducts = async () => {
        try {
            const response = await fetch("https://billing-system-sno9.onrender.com/api/product/getall", {
                method: "GET",
                headers: {
                    'Content-type': 'application/json',
                },
            })
            const result = await response.json()
            let totalPrice = 0;
            result.forEach(product => {
                totalPrice += product.purchasePrice; // Assuming each product object has a 'price' property
            });
            let totalProduct = 0;
            result.forEach(product => [
                totalProduct += product.quantity
            ])
            setTotalProducts(totalProduct)
            setTotalPurchase(totalPrice)

            const filteredItems = result.filter(item =>
                item.productName.toLowerCase().includes(search.toLowerCase())
            );
            // console.log(filteredItems)

            setProducts(filteredItems);


            // setProducts(result)
        } catch (error) {
            toast.error("An Error Has Occured")
            // console.log(error)

        }
    }

    useEffect(() => {
        showAllproducts();
    }, [search]);


    // ------------------ THE ADDING RPODUCT SECTION -----------------

    const handleAddProduct = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch("https://billing-system-sno9.onrender.com/api/product/add", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ barcode, productName, category, quantity, saleprice, purchasePrice, unit })
            })
            if (response.ok) {
                const successMessage = await response.text();
                Swal.fire({
                    title: 'success',
                    text: 'Product Added successfully',
                    icon: 'success'
                })
                setBarcode('')
                setproductName('')
                setquantity('')
                setSetsalePrice('')
                setpurchasePrice('')
                setUnit("")
                // toast.success('Product Added successfully');
            } else {
                const errorMessage = await response.text();
                Swal.fire({
                    title: 'error',
                    text: `Error Occured Try agian`,
                    icon: 'error'
                })

            }
        } catch (error) {
            // console.log(error)
            Swal.fire({
                title: 'error',
                text: 'Please Provide All The Information',
                icon: 'error'
            })
            // toast.error("Error Please Provide All The Information")

        }
    }

    // ----------- DELTEING THE PRODUCTS ----------------------------

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this product',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`https://billing-system-sno9.onrender.com/api/product/delete/${id}`, {
                        method: "DELETE"
                    });
                    if (response.ok) {
                        showAllproducts()
                        Swal.fire({
                            title: 'Success!',
                            text: 'product deleted successfully',
                            icon: 'success',
                            confirmButtonText: 'Cool'
                        });
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Failed to delete product',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                } catch (error) {
                    console.error('Error:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'An error occurred while deleting the product',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            }
        });

    }

    // ------------ UPDATING THE PRODUCTS ---------------
    const [currentProduct, setCurrentProduct] = useState(null);

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setBarcode(product.barcode)
        setproductName(product.productName);
        setCategory(product.category);
        setquantity(product.quantity);
        setSetsalePrice(product.saleprice);
        setpurchasePrice(product.purchasePrice);
        setUnit(product.unit);
        // alert(product.unit)
        // setAccountBalance(customer.AccountBalance);
    };

    const handleUpdate = async (e, id) => {
        // e.preventDefault()
        try {
            const response = await fetch(`https://billing-system-sno9.onrender.com/api/product/update/${currentProduct._id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ barcode, productName, category, quantity, saleprice, purchasePrice, unit })
            })
            if (response.ok) {
                const updatedData = await response.json();
                setProducts(updatedData);
                Swal.fire({
                    title: 'Success!',
                    text: 'Product Updated Successfully',
                    icon: 'success',
                    confirmButtonText: 'Cool'
                });
                // toast.success("Product Updated Successfully");
            } else {
                toast.error("Failed to update Product");
            }
        } catch (error) {
            Swal.fire({
                title: 'error!',
                text: 'Failed to update Product',
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
            // toast.error("Error Please Try Again Later")
        }
    }

    return (
        <>
            <Navbar />
            <section id="product_table_home">
                <form action="">
                    <div className="product_table_fields">
                        <input type="text" placeholder="Barcode" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
                        <input type="text" placeholder="Product Name" value={productName} onChange={(e) => setproductName(e.target.value)} />
                        <input type="text" placeholder="Quantity" value={quantity} onChange={(e) => setquantity(e.target.value)} />
                        <input type="text" placeholder="Sales Price" value={saleprice} onChange={(e) => setSetsalePrice(e.target.value)} />
                        <input type="text" placeholder="Purchase Price" value={purchasePrice} onChange={(e) => setpurchasePrice(e.target.value)} />
                        <input type="text" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
                    </div>
                    {/* ----------- THE QUAGGA CODE _------------ */}
                    {scanning ?
                        <div id="scanner"
                            style={{
                                // position: "absolute",
                                // top: "23%",
                                // left: "25%",
                                // bottom: "0%",
                                width: "30%",
                                height: "90%",
                                backgroundColor: "#eee",
                                // zIndex: '999'
                            }}
                        >
                        </div>
                        :
                        <>

                            {/* Render product table and other elements here, as in your original component */}
                            <div className="product_tables">
                                <input type="search" name="" id="" placeholder='Search Products..'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <table width="100%" className="info_table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Barcode</th>
                                            <th>Product Name</th>
                                            <th>Unit</th>
                                            <th>Quantity</th>
                                            <th>cost/unit</th>
                                            <th>Sales Price</th>
                                            <th>Total Cost</th>
                                            <th>Delete</th>
                                            <th>Update</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(products) && products.map((product, index) => (
                                            <tr key={product._id}>
                                                <td>{index + 1}</td>
                                                <td>{product.barcode ? product.barcode : 'no-barcode'}</td>
                                                <td>{product.productName}</td>
                                                <td>{product.unit ? product.unit : "others"}</td>
                                                {/* <td>{product.category}</td> */}
                                                <td>{product.quantity}</td>
                                                <td>{product.purchasePrice}</td>
                                                <td>{product.saleprice}</td>
                                                <td>{product.purchasePrice * product.quantity}</td>
                                                <td><XCircle size={16} onClick={(e) => handleDelete(product._id)} style={{
                                                    cursor: "pointer"
                                                }} /></td>
                                                <td><Pen size={16} onClick={() => handleEdit(product)} style={{
                                                    cursor: "pointer"
                                                }} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* THE QUAGG FUNCI ENDING HERE */}
                        </>
                    }
                    <div className="product_left">
                        <div className="order_btns">
                            <button onClick={handleAddProduct} >Add Product</button>
                            <button onClick={handleUpdate}>Update</button>
                            <button type="button" onClick={startScanning}>
                                {scanning ? "Open Camera" : "Scan Barcode"}
                            </button>
                            <button onClick={stopScanner}>Stop</button>
                        </div>
                        <table width="30%" className='total_table '>
                            <thead>
                                <tr>
                                    <th>Total Products</th>
                                    <td>{totalProdcuts}</td>
                                </tr>
                            </thead>

                        </table>
                    </div>
                </form>
            </section>

        </>
    )
}

export default ProductPage

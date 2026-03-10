import React, { useState, useEffect } from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import Navbar from '../componentes/Navbar'
import react from '../assets/react.svg'

import logo from '../assets/logo.png'
import { Slash } from 'lucide-react';


const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        padding: 20,
        fontSize: '10px'
    },
    line: {
        display: 'flex',
        gap: '1rem',
        width: '100%',
        border: '1px solid grey',
    },
    section: {
        flexGrow: 1,
    },
    companyDetails: {
        marginBottom: 20,
        textAlign: 'center'
    },
    invoiceDetails: {
        display: 'flex',
        textAlign: 'start',
        width: '100%',

    },
    part2: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginTop: 20
    },
    heading: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: "center",
        // fontSize: 16,
        marginBottom: 4,
        textDecoration: 'underline',
        textAlign: 'center',
        fontSize: '10px'
    },
    table: {
        display: 'table',
        width: '100%',
        // borderStyle: 'solid',
        border: 1,
        margin: 10,
    },
    tableRow: {
        flexDirection: 'row',
        // border: .3,

    },
    tableCellHeader: {
        padding: 7,
        // borderStyle: 'solid',
        // borderLeft: 1,
        borderRight: 1,
        // borderTop: 1,
        // borderWidth: '1px solid black',
        textAlign: 'center',
        fontSize: '12px',
        // borderBottom: 1,
        width: "100%",
    },
    tableCell: {
        padding: 5,
        width: "100%",
        fontSize: '10px',
        textAlign: 'center',
        borderRight: 1,
        borderTop: 1,
        // borderWidth: '1px solid grey',

    },
    amount: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row',
        paddingRight: '10%',
        // textAlign: 'center',
        // gap: '90px'
        marginTop: '-8px',
        // margin: '1px'
    },
    total_amount: {
        display: 'flex',
        flexDirection: 'row',
        // alignItems: 'center',
    },
    price: {
        border: 1,
        // fontWeight: 'bold',
        width: '22.4%',
        backgroundColor: '#edece8',
        marginLeft: '2%',
        marginRight: '-13%',
        textAlign: 'center',
        padding: '4px',
        // margin: "1px"
    },
    words: {
        // marginTop: '40px',
        // textDecoration: 'underline',
        fontSize: '12px',
        margin: '3px',
        borderStyle: 'solid'
    },
    cash: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row',
        paddingRight: '10%',
        // textAlign: 'center',
        // gap: '90px'
        marginTop: '1px',
        // margin: "1rem"
    },
    container: {
        flexDirection: 'row', // Align children in a row
        alignItems: 'center', // Vertically align items
        gap: '10rem'
        // gap: 120, // For web (or React Native Web), you can use this. For React Native, use marginRight/marginLeft instead.
    },
    companyDetails: {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
        gap: 2,
        fontStyle: 'bold',
        // border: '1px solid red',
        marginLeft: -30,
        // alignContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 50,  // Set your desired logo width
        height: 50, // Set your desired logo height
        marginRight: 16, // Space between the logo and the company details
    },

});


const DailySalesReport = () => {
    const [companyData, setCompanyData] = useState('');
    const [orderData, setOrderData] = useState({});


    // -------------------- SHOWING THE COMPANY DATA

    const showCompanyDate = async () => {
        try {
            const response = await fetch('https://billing-system-sno9.onrender.com/api/company/get', { method: "GET" });
            const result = await response.json();
            setCompanyData(result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        showCompanyDate();
    }, []);



    // ----------------------------- SHOWING THE UNPAID BALANCE
    const [todaySales, setTodaySales] = useState([])
    const [products, setProduct] = useState([]);

    // console.log(products)

    const ShowAllorders = async () => {
        try {
            const response = await fetch("https://billing-system-sno9.onrender.com/api/order/getall", {
                method: "GET"
            });
            const result = await response.json();
            const today = new Date().toISOString().split('T')[0];
            const TodaySales = result.filter(item => new Date(item.createdAt).toISOString().split('T')[0] === today);
            setTodaySales(TodaySales);
            // setProduct(TodaySales.products);

        } catch (error) {
            console.log("Fetching Orders Error", error);
        }
    };


    useEffect(() => {
        ShowAllorders();
    }, []);





    const FormattedDate = new Date(orderData.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });


    //  total price of each bill
    const TotalPrice = todaySales.map(sale => {
        const billTotal = sale.products.reduce((total, product) => {
            const price = parseFloat(product.price) || 0;
            const quantity = parseFloat(product.quantity) || 0;
            return total + (price * quantity);
        }, 0);
        return billTotal;
    });


    // overall price
    const TotalAmount = todaySales.reduce((overallTotal, sale) => {
        const saleTotal = sale.products.reduce((total, product) => {
            const price = parseFloat(product.price) || 0;
            const quantity = parseFloat(product.quantity) || 0;
            return total + (price * quantity);
        }, 0);
        return overallTotal + saleTotal; // Add sale total to the overall total
    }, 0);


    function generateInvoice() {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <View style={styles.container}>
                            <View>
                                {companyData.length > 0 && companyData[0].logo && (
                                    <Image source={{ uri: companyData[0].logo }} style={styles.logo} />
                                )}
                            </View>
                            <View style={styles.section}>
                                <View style={styles.companyDetails}>
                                    {/* <Text style={styles.heading}>Company Details</Text> */}
                                    {companyData.length > 0 && (
                                        <>
                                            <Text>{companyData[0].companyName}</Text>
                                            <Text>{companyData[0].Address}</Text>
                                            <Text>Phone No: {companyData[0].phone}</Text>

                                        </>
                                    )}
                                </View>
                            </View>
                        </View>
                        <View style={styles.invoiceDetails}>
                            <View style={styles.part2}>
                                <Text>Invoice No:  1</Text>
                                <Text>Sales Report: {format(new Date(Date.now()), 'dd-MMMM-yyyy')}</Text>
                                <Text style={{ ...styles.text, textDecoration: 'underline' }}>Invoice</Text>
                                {/* <Text>Date: {orderData.date ? format(new Date(orderData.date), 'dd-MMMM-yyyy') : ''}</Text> */}
                            </View>
                            <View style={styles.table}>
                                <View style={styles.tableRow}>

                                    <Text style={styles.tableCellHeader}>Name</Text>
                                    <Text style={styles.tableCellHeader}>Invoice No</Text>
                                    <Text style={styles.tableCellHeader}>Status</Text>
                                    <Text style={styles.tableCellHeader}>Amount</Text>
                                </View>
                                {todaySales.map((sales, index) => (
                                    <View style={styles.tableRow} key={index} >
                                        <Text style={styles.tableCell}>{sales.customer.name}</Text>
                                        <Text style={styles.tableCell}>Invoice No {sales.InvoiceNo} Issued</Text>
                                        <Text style={styles.tableCell}>{sales.paid == true ? 'paid' : 'unpaid'}</Text>
                                        <Text style={styles.tableCell}>{sales.products.reduce((total, product) => {
                                            return total + product.price * product.quantity;
                                        }, 0)}.00</Text>

                                    </View>
                                ))}
                            </View>
                            <View style={styles.amount}>
                                <Text style={styles.total_amount}>Total Price (in ):</Text>
                                <Text style={styles.price}>{TotalAmount}.00</Text>
                            </View>
                        </View>
                    </View>
                </Page>
            </Document>
        );
    }

    return (
        <>
            <Navbar />

            <PDFViewer style={{ width: '90vw', height: '98vh', backgroundColor: "black" }}>
                {generateInvoice()}
            </PDFViewer>
        </>
    );
};

export default DailySalesReport;

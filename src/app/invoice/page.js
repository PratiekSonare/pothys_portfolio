"use client"
import React, { useState, Suspense, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

// Dynamically import jsPDF and html2canvas for SSR compatibility
const jsPDF = dynamic(() => import("jspdf"), { ssr: false });
const html2canvas = dynamic(() => import("html2canvas"), { ssr: false });

const SearchParamsWrapper = ({ setTransactionData }) => {
  const searchParam = useSearchParams();
  const transactionId = searchParam.get("transaction_id");

  useEffect(() => {
    if (transactionId) {
      const fetchTransactionData = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/transactions?transaction_id=${transactionId}`, {
              headers: {
                "x-api-key": `${process.env.NEXT_PUBLIC_TRANSACTION_API_KEY}`,
              },
            });
          const data = await response.json();

          if (data.success) {
            setTransactionData(data.transactions[0]);
          } else {
            console.error("Error fetching transactionData:", data.message);
          }
        } catch (error) {
          console.error("Fetch error:", error);
        }
      };

      fetchTransactionData();
    }
  }, [transactionId, setTransactionData]);

  return null; // This component does not render anything
};

const generateInvoice = () => {
  const [transactionData, setTransactionData] = useState(null);
  const pdfRef = useRef(null);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsWrapper setTransactionData={setTransactionData} />
      {transactionData ? (
        <InvoiceContent transactionData={transactionData} pdfRef={pdfRef} />
      ) : (
        <div>Loading...</div>
      )}
    </Suspense>
  );
};

const InvoiceContent = ({ transactionData, pdfRef }) => {
  const generatePDF = async () => {
    if (!pdfRef.current) return;

    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", [80, 397]);
    const imgWidth = 80;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("invoice.pdf");
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="font-serif flex flex-col items-center justify-center gap-10">
        <button
          onClick={generatePDF}
          className="rounded-lg"
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Download Invoice PDF
        </button>

        <button
          onClick={printInvoice}
          className="rounded-lg"
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Print Invoice
        </button>

        <div
          ref={pdfRef}
          style={{
            padding: "10px",
            backgroundColor: "white",
            width: "80mm",
            margin: "auto",
            border: "1px solid #ccc",
          }}
          className="invoice"
        >
          <h1 style={{ textAlign: "center", fontSize: "16px" }}>
            <strong>Tax Invoice</strong>
          </h1>

          <div className="flex flex-col gap-0 my-2">
            <p className="text-[20px] font-bold">SK Super Market</p>
            <p className="text-[8px]">
              151/1 SSM COMPLEX GROUND FLOOR EAST PONDY ROAD, Koliyanur
            </p>
            <p className="text-[8px]">
              <strong>Phone:</strong> +91-6360529172 | <strong>GSTIN:</strong>{" "}
              33KARPK3018P1Z2
            </p>
          </div>
          <hr />

          <div className="flex flex-col">
            <table
              width="100%"
              cellPadding="2"
              style={{
                textAlign: "left",
                width: "100%",
                border: "1px solid black",
                borderCollapse: "collapse",
              }}
              className="text-[5px]"
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid black",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  <th
                    style={{
                      padding: "5px",
                      fontWeight: "bold",
                      borderRight: "1px solid black",
                      width: "40%",
                    }}
                  >
                    Bill To:
                  </th>
                  <th style={{ padding: "5px", fontWeight: "bold", width: "60%" }}>
                    Invoice Details:
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "5px", borderRight: "1px solid black", fontSize: "16px" }}>
                    {transactionData.customer.customer_name}
                  </td>
                  <td style={{ padding: "5px", fontSize: "6px" }}>
                    <p>No: {transactionData.transaction_id}</p>
                    <p>
                      Date:{" "}
                      {new Date(transactionData.date_time).toLocaleDateString()}
                    </p>
                    <p>
                      Time:{" "}
                      {new Date(transactionData.date_time).toLocaleTimeString()}
                    </p>
                    <p>Place of Supply: {transactionData.customer.address}</p>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Render Cart Items */}
            <table
              width="100%"
              cellPadding="2"
              style={{
                borderCollapse: "collapse",
                textAlign: "left",
                width: "100%",
                border: "1px solid black",
              }}
              className="text-[5px]"
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid black",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  <th style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black", width: "5%" }}>
                    #
                  </th>
                  <th style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black", width: "35%" }}>
                    Item Name
                  </th>
                  <th style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black", width: "20%" }}>
                    HSN/SAC/ID
                  </th>
                  <th style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black", width: "10%" }}>
                    MRP (₹)
                  </th>
                  <th style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black", width: "10%" }}>
                    Quantity
                  </th>
                  <th style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black", width: "10%" }}>
                    Discount (₹)
                  </th>
                  <th style={{ padding: "5px", fontWeight: "bold", width: "10%" }}>
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactionData.cartItems.map((item, index) => (
                  <tr key={item._id}>
                    <td style={{ padding: "5px", borderRight: "1px solid black", fontSize: "8px" }}>
                      {index + 1}
                    </td>
                    <td style={{ padding: "5px", borderRight: "1px solid black", fontSize: "8px" }}>
                      {item.name}
                    </td>
                    <td style={{ padding: "5px", borderRight: "1px solid black" }}>
                      {item._id}
                    </td>
                    <td style={{ padding: "5px", borderRight: "1px solid black", fontSize: "10px" }}>
                      {item.price.toFixed(2)}
                    </td>
                    <td style={{ padding: "5px", borderRight: "1px solid black" }}>
                      {item.quantityType}
                    </td>
                    <td style={{ padding: "5px", borderRight: "1px solid black" }}>
                      {/* {(item.price - item.discounted_price).toFixed(2)} */}
                    </td>
                    <td style={{ padding: "5px", fontSize: "8px" }}>
                      {/* {item.discounted_price.toFixed(2)} */}
                    </td>
                  </tr>
                ))}

                {/* Total Amount Row */}
                <tr style={{ borderTop: "2px solid black" }}>
                  <td colSpan="6" style={{ padding: "5px", fontSize: "10px", textAlign: "right" }}>
                    Total Amount:
                  </td>
                  <td style={{ padding: "5px", fontSize: "10px", fontWeight: "bold" }}>
                    <span>₹{transactionData.total_amount.toFixed(2)}</span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* Tax Summary */}
          <h4 className="text-[12px] font-semibold my-2 ">Tax Summary:</h4>
          <table
            width="100%"
            cellPadding="2"
            style={{
              borderCollapse: "collapse",
              textAlign: "left",
              width: "100%",
              border: "1px solid black",
              fontSize: "5px", // text-[5px] equivalent
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid black", backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black", width: "20%" }}>HSN/SAC</th>
                <th style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black", width: "20%" }}>Taxable Amount (₹)</th>
                <th colSpan="2" style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black", width: "20%" }}>CGST</th>
                <th colSpan="2" style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black", width: "20%" }}>SGST</th>
                <th style={{ padding: "5px", fontWeight: "bold", width: "20%" }}>Total Tax (₹)</th>
              </tr>
              <tr style={{ borderBottom: "1px solid black", backgroundColor: "#f9f9f9" }}>
                <th style={{ borderRight: "1px solid black" }}></th>
                <th style={{ borderRight: "1px solid black" }}></th>
                <th style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black" }}>Rate (%)</th>
                <th style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black" }}>Amt (₹)</th>
                <th style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black" }}>Rate (%)</th>
                <th style={{ padding: "5px", fontWeight: "bold", borderRight: "1px solid black" }}>Amt (₹)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "5px" }}>NA</td>
              </tr>
              <tr>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "5px" }}>NA</td>
              </tr>
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "2px solid black", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>TOTAL</td>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>NA</td>
                <td style={{ padding: "5px" }}>NA</td>
              </tr>
            </tfoot>
          </table>

          {/* Payment Mode */}
          <table
            width="100%"
            cellPadding="2"
            style={{
              borderCollapse: "collapse",
              textAlign: "left",
              width: "100%",
              fontSize: "10px",  // text-[5px] equivalent
              border: "1px solid black"
            }}
          >
            <tbody>
              <tr style={{ borderBottom: "1px solid black", fontWeight: "bold" }}>
                <td style={{ padding: "5px", width: "50%", borderRight: "1px solid black", backgroundColor: "#f2f2f2" }}>Payment Mode:</td>
                <td style={{ padding: "5px", textAlign: "left" }}>Cash</td>
              </tr>
            </tbody>
          </table>

          {/* Bank Details */}
          <table
            width="100%"
            cellPadding="2"
            style={{
              borderCollapse: "collapse",
              textAlign: "left",
              width: "100%",
              fontSize: "10px",  // text-[5px] equivalent
              border: "1px solid black"
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid black", backgroundColor: "#f2f2f2", fontWeight: "bold" }}>
                <th style={{ padding: "5px", borderRight: "1px solid black" }}>Bank Details:</th>
                <th style={{ padding: "5px" }}>For SK Supermarket:</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid black" }}>
                <td style={{ padding: "5px", borderRight: "1px solid black" }}>
                  <p><strong>Name:</strong> HDFC BANK, BANGALORE - VIJAYANAGAR</p>
                  <p><strong>Account No.:</strong> 50100534953269</p>
                  <p><strong>IFSC Code:</strong> HDFC0000312</p>
                  <p><strong>Account Holder:</strong> PREM KUMAR</p>
                </td>
                <td style={{ padding: "5px", height: 'auto', verticalAlign: "bottom" }}>
                  <p style={{}}>Authorized Signatory / Date</p>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Terms & Conditions */}
          <table
            width="100%"
            cellPadding="2"
            style={{
              borderCollapse: "collapse",
              textAlign: "left",
              width: "100%",
              fontSize: "10px",  // text-[5px] equivalent
              border: "1px solid black"
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid black", backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "5px", fontWeight: "bold" }}>Terms & Conditions:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "5px", verticalAlign: "bottom" }}>
                  Thank you for doing business with us!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Suspense>
  );
};

export default generateInvoice;
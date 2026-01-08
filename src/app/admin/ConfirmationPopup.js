// ConfirmationPopup.js
import React from 'react';

const ConfirmationPopup = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-black">{message}</h2>
                <div className="flex justify-end space-x-4">
                    <button onClick={onCancel} className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;
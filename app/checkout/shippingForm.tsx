'use client'
import React from "react";

interface dropdownProps {
    options: string[],
    selection: number
    selectCallback: (index: number) => void,
}

function Dropdown({options, selection, selectCallback}: dropdownProps) {
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(()=> {
        function onClickOutside(e: MouseEvent) {
            if (dropdownOpen && !menuRef.current?.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }

        if (typeof window !== 'undefined') {
            document.addEventListener('mousedown', onClickOutside);

            return () => {
                document.removeEventListener('mousedown', onClickOutside);
            };
        }
    },[dropdownOpen])

    return(
        <div className="flex-1 relative">
            <button
                onClick={e => {
                    e.preventDefault()
                    setDropdownOpen(!dropdownOpen)
                }}
                className="w-full bg-white border border-gray-200 rounded-md py-2 px-4">
                <p className={`text-left ${selection === -1 ? 'text-gray-400' : ''}`}>
                    {selection === -1 ? options[0] : options[selection]}
                </p>
            </button>
            <div ref={menuRef}
                className={`${dropdownOpen? 'max-h-48' : 'max-h-0 invisible'} transition-all duration-300 ease-in-out delay-150 flex-1 bg-white shadow-lg border border-gray-200 rounded-md px-2 absolute w-full overflow-y-auto mt-1 z-50`}>
                {options.map((optionName, index) => (
                    <button 
                        key={index} 
                        className={`w-full leading-5 py-2 px-4 text-left ${index === selection ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                        onClick={(e) => {
                            e.preventDefault();
                            selectCallback(index);
                            setDropdownOpen(false);
                        }}
                    >
                        {optionName}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default function ShippingForm() {
    const [email, setEmail] = React.useState('')
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('')
    const [address, setAddress] = React.useState('')
    const [countryIndex, setCountryIndex] = React.useState(-1)
    const [provinceIndex, setProvinceIndex] = React.useState(-1)
    const [city, setCity] = React.useState('')
    const [postalCode, setPostalCode] = React.useState('')
    const [phone, setPhone] = React.useState('')

    const countryOptions = ['Select Country', 'Canada']
    const provinceOptions = ['Select Province', "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"]

    return (
        <form>
            <p className="font-bold text-xl pb-2">Shipping Information</p>
            <div className="mt-6">
                <label className="lg:flex lg:flex-row items-center">
                    <p className="font-medium w-36">Email Address</p>
                    <input
                        className="flex-1 w-full border border-gray-200 rounded-md py-2 px-4"
                        type={"email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Email"
                    />
                </label>
            </div>
            <div className="mt-6">
                <label className="lg:flex lg:flex-row items-center my-2">
                    <p className="font-medium w-36">First Name</p>
                    <input
                        className="flex-1 w-full border border-gray-200 rounded-md py-2 px-4"
                        type={"text"}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter First Name"
                    />
                </label>
            </div>
            <div className="mt-6">
                <label className="lg:flex lg:flex-row items-center my-2">
                    <p className="font-medium w-36">Last Name</p>
                    <input
                        className="flex-1 w-full border border-gray-200 rounded-md py-2 px-4"
                        type={"text"}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter Last Name"
                    />
                </label>
            </div>
            <div className="mt-6">
                <label className="lg:flex lg:flex-row items-center my-2">
                    <p className="font-medium w-36">Street Address</p>
                    <input
                        className="flex-1 w-full border border-gray-200 rounded-md py-2 px-4"
                        type={"text"}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter Street Address"
                    />
                </label>
            </div>
            <div className="mt-6">
                <label className="lg:flex lg:flex-row items-center relative z-40">
                    <p className="font-medium w-36">Country</p>
                    <Dropdown options={countryOptions} selection={countryIndex} selectCallback={(index) => {
                        if (index === 0) {
                            setCountryIndex(-1);
                        } else {
                            setCountryIndex(index);
                        }
                    }}/>
                </label>
            </div>
            <div className="mt-6">
                <label className="lg:flex lg:flex-row items-center relative z-30">
                    <p className="font-medium w-36">State/Province</p>
                    <Dropdown options={provinceOptions} selection={provinceIndex} selectCallback={(index) => {
                        if (index === 0) {
                            setProvinceIndex(-1);
                        } else {
                            setProvinceIndex(index);
                        }
                    }}/>
                </label>
            </div>
            <div className="mt-6">
                <label className="lg:flex lg:flex-row items-center my-2">
                    <p className="font-medium w-36">City</p>
                    <input
                        className="flex-1 w-full border border-gray-200 rounded-md py-2 px-4"
                        type={"text"}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter City"
                    />
                </label>
            </div>
            <div className="mt-6">
                <label className="lg:flex lg:flex-row items-center my-2">
                    <p className="font-medium w-36">Zip/Postal Code</p>
                    <input
                        className="flex-1 w-full border border-gray-200 rounded-md py-2 px-4"
                        type={"text"}
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Enter Zip/Postal Code"
                    />
                </label>
            </div>
            <div className="mt-6">
                <label className="lg:flex lg:flex-row items-center">
                    <p className="font-medium w-36">Phone Number</p>
                    <input
                        className="flex-1 w-full border border-gray-200 rounded-md py-2 px-4"
                        type={"text"}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter Phone Number"
                    />
                </label>
            </div>
        </form>
    )
}
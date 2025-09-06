import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiEdit2, FiTrash2, FiSearch, FiPlus, FiMapPin, FiDownload, FiX, FiSave, FiXCircle } from 'react-icons/fi';
import axios from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    address: '',
    status: 'Active'
  });
  const [showModal, setShowModal] = useState({
    update: false,
    delete: false
  });
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mobileView, setMobileView] = useState('list');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/employees');
        setEmployees(response.data.employees);
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast.error('Failed to load employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Sort employees
  const sortedEmployees = [...employees].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // PDF Download function
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Employees Report', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });

    const tableColumn = ["S.No", "Name", "Email", "Phone", "Position", "Address", "Status"];
    const tableRows = [];

    filteredEmployees.forEach((employee, index) => {
      const employeeData = [
        index + 1,
        employee.name,
        employee.email,
        employee.phone || 'N/A',
        employee.position,
        employee.address || 'N/A',
        employee.status
      ];
      tableRows.push(employeeData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [16, 185, 129] },
      margin: { top: 30 }
    });

    doc.save('employees-report.pdf');
  };

  const handleEditClick = (employee) => {
    setEditingId(employee._id);
    setEditFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone || '',
      position: employee.position,
      address: employee.address || '',
      status: employee.status
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (id) => {
    setIsProcessing(true);
    try {
      const response = await axios.put(`/employees/${id}`, editFormData);
      setEmployees(employees.map(emp =>
        emp._id === id ? { ...emp, ...response.data.employee } : emp
      ));
      toast.success('Employee updated successfully');
      setEditingId(null);
    } catch (error) {
      console.error('Error updating employee:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to update employee';
      toast.error(errorMessage);

      if (error.response?.data?.field) {
        toast.error(`Error in ${error.response.data.field} field`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteClick = (id) => {
    setCurrentEmployeeId(id);
    setShowModal({ ...showModal, delete: true });
  };

  const confirmDelete = async () => {
    setIsProcessing(true);
    try {
      await axios.delete(`/employees/${currentEmployeeId}`);
      setEmployees(employees.filter(employee => employee._id !== currentEmployeeId));
      toast.success('Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error(error.response?.data?.message || 'Failed to delete employee');
    } finally {
      setIsProcessing(false);
      setShowModal({ ...showModal, delete: false });
      setCurrentEmployeeId(null);
    }
  };

  const filteredEmployees = sortedEmployees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.phone && employee.phone.includes(searchTerm)) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.address && employee.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Mobile Card View with Edit functionality
  const EmployeeCard = ({ employee }) => (
    <div className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-200">
      {editingId === employee._id ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleEditFormChange}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Name"
            />
          </div>
          
          <input
            type="email"
            name="email"
            value={editFormData.email}
            onChange={handleEditFormChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Email"
          />
          
          <input
            type="tel"
            name="phone"
            value={editFormData.phone}
            onChange={handleEditFormChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Phone"
          />
          
          <input
            type="text"
            name="position"
            value={editFormData.position}
            onChange={handleEditFormChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Position"
          />
          
          <input
            type="text"
            name="address"
            value={editFormData.address}
            onChange={handleEditFormChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Address"
          />
          
          <select
            name="status"
            value={editFormData.status}
            onChange={handleEditFormChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => handleEditSubmit(employee._id)}
              disabled={isProcessing}
              className="flex items-center px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
            >
              <FiSave className="mr-1" size={14} />
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              <FiXCircle className="mr-1" size={14} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <FiUser className="text-emerald-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">{employee.name}</h3>
                <p className="text-xs text-gray-500">{employee.position}</p>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {employee.status}
            </span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600">
              <FiMail className="mr-2" />
              <span className="truncate">{employee.email}</span>
            </div>
            {employee.phone && (
              <div className="flex items-center text-gray-600">
                <FiPhone className="mr-2" />
                <span>{employee.phone}</span>
              </div>
            )}
            {employee.address && (
              <div className="flex items-center text-gray-600">
                <FiMapPin className="mr-2" />
                <span className="truncate">{employee.address}</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200">
            <button
              className="text-emerald-600 hover:text-emerald-900 transition-colors cursor-pointer p-1"
              onClick={() => handleEditClick(employee)}
            >
              <FiEdit2 size={16} />
            </button>
            <button
              className="text-red-600 hover:text-red-900 transition-colors cursor-pointer p-1"
              onClick={() => handleDeleteClick(employee._id)}
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Confirmation Modal */}
        {showModal.delete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this employee? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal({ ...showModal, delete: false })}
                  disabled={isProcessing}
                  className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isProcessing}
                  className={`px-4 py-2 text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors bg-red-600 hover:bg-red-700 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </div>
                  ) : (
                    'Confirm Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 lg:mb-0">Employee List</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Mobile View Toggle */}
            <div className="lg:hidden flex bg-gray-100 rounded-md p-1 mb-3 sm:mb-0">
              <button
                onClick={() => setMobileView('list')}
                className={`px-3 py-1 text-sm rounded-md ${mobileView === 'list' ? 'bg-white shadow' : 'text-gray-600'}`}
              >
                List
              </button>
              <button
                onClick={() => setMobileView('cards')}
                className={`px-3 py-1 text-sm rounded-md ${mobileView === 'cards' ? 'bg-white shadow' : 'text-gray-600'}`}
              >
                Cards
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => navigate('/dashboard/add-employee')}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors cursor-pointer"
              >
                <FiPlus className="mr-2" />
                Add Employee
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center justify-center px-3 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 cursor-pointer"
              >
                <FiDownload className="mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search employees by name, email, phone, position, or address..."
              className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            {mobileView === 'cards' && (
              <div className="lg:hidden">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <EmployeeCard key={employee._id} employee={employee} />
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-500">No employees found</p>
                  </div>
                )}
              </div>
            )}

            {/* Desktop Table View */}
            <div className={`${mobileView === 'cards' ? 'hidden lg:block' : ''}`}>
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => requestSort('name')}
                        >
                          Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Contact
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => requestSort('position')}
                        >
                          Position {sortConfig.key === 'position' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Address
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => requestSort('status')}
                        >
                          Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                          <tr key={employee._id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              {editingId === employee._id ? (
                                <input
                                  type="text"
                                  name="name"
                                  value={editFormData.name}
                                  onChange={handleEditFormChange}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                />
                              ) : (
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <FiUser className="text-emerald-600" />
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                                    <div className="text-xs text-gray-500 sm:hidden">{employee.email}</div>
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-4 hidden sm:table-cell">
                              {editingId === employee._id ? (
                                <>
                                  <input
                                    type="email"
                                    name="email"
                                    value={editFormData.email}
                                    onChange={handleEditFormChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                  />
                                  <input
                                    type="tel"
                                    name="phone"
                                    value={editFormData.phone}
                                    onChange={handleEditFormChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                  />
                                </>
                              ) : (
                                <>
                                  <div className="text-sm text-gray-500">{employee.email}</div>
                                  <div className="text-sm text-gray-500">{employee.phone || 'N/A'}</div>
                                </>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              {editingId === employee._id ? (
                                <input
                                  type="text"
                                  name="position"
                                  value={editFormData.position}
                                  onChange={handleEditFormChange}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                />
                              ) : (
                                <div className="text-sm text-gray-900">{employee.position}</div>
                              )}
                            </td>
                            <td className="px-4 py-4 hidden md:table-cell">
                              {editingId === employee._id ? (
                                <input
                                  type="text"
                                  name="address"
                                  value={editFormData.address}
                                  onChange={handleEditFormChange}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                />
                              ) : (
                                <div className="text-sm text-gray-500 truncate max-w-xs">{employee.address || 'N/A'}</div>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              {editingId === employee._id ? (
                                <select
                                  name="status"
                                  value={editFormData.status}
                                  onChange={handleEditFormChange}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                  <option value="Active">Active</option>
                                  <option value="Inactive">Inactive</option>
                                </select>
                              ) : (
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                >
                                  {employee.status}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4 text-right text-sm font-medium">
                              {editingId === employee._id ? (
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => handleEditSubmit(employee._id)}
                                    disabled={isProcessing}
                                    className="flex items-center px-3 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
                                  >
                                    <FiSave className="mr-1" size={14} />
                                    Save
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="flex items-center px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                  >
                                    <FiXCircle className="mr-1" size={14} />
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex justify-end space-x-2">
                                  <button
                                    className="text-emerald-600 hover:text-emerald-900 transition-colors cursor-pointer"
                                    onClick={() => handleEditClick(employee)}
                                  >
                                    <FiEdit2 size={16} />
                                  </button>
                                  <button
                                    className="text-red-600 hover:text-red-900 transition-colors cursor-pointer"
                                    onClick={() => handleDeleteClick(employee._id)}
                                  >
                                    <FiTrash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-4 py-4 text-center text-sm text-gray-500">
                            No employees found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
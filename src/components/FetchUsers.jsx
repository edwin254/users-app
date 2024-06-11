// fetch users data from mock API
import React, { useEffect,  useState } from "react"
import { Pagination } from "@nextui-org/pagination";
import UserModal from "./UserModal";

const FetchUsers = () => {

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredUsers, setfilteredUsers] = useState([])
  const pageSize = 5
 
  const fetchData = () => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => {
        return response.json()
      })
      .then(data => {
        setUsers(data)
        setTotalPages(Math.ceil(data.length / pageSize));
        setfilteredUsers(data.slice(0, pageSize))
      })
      .catch(error => console.log(error));
  }

  useEffect(() => {
    fetchData()
    // TODO: USe pageNumber, searchQuery to trigger fetch for real prod APi
  }, []);

  useEffect(() => {
    console.log("'>>>>>>>", pageNumber)
    let startIdx = (pageNumber - 1) * pageSize
    let endIdx = (pageSize * pageNumber) - 1;
    setfilteredUsers( users.slice(startIdx, endIdx))
  }, [pageNumber]);

  // Pagination
  const onPageChange = (v) => {
    setPageNumber(parseInt(v));
  };

  // Search functionality
  const handleSearchChange = (e) => {
    var query = e.target.value;
    setSearchQuery(query);
    
    var data = users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()))
    setfilteredUsers(data)
    // TODO: Implement fuzzy matching
  };

  const removeUser = (id) => {
    var data = users.filter(user => user.id !== id)
    setUsers(data)
    setfilteredUsers(data.slice(0, pageSize))
    setTotalPages(Math.ceil(data.length / pageSize));
    if(pageNumber > totalPages){
      setPageNumber(pageNumber-1)
    }
    console.log("<<<<<", pageNumber)
    console.log(data.length)

  }
  // // Modal for editing user details
  // const [modalOpen, setModalOpen] = useState(false);
  // const openModal = () => setModalOpen(true);
  // const closeModal = () => setModalOpen(false);

  return (
    <>
    <div>
  
      {/* Search form */}
      <input type="text" placeholder="Search..." value={searchQuery}  onChange={handleSearchChange}/>

      {/* Users table */}
      <table>
        
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.company.name}</td>
              <td><button onClick={() => removeUser(user.id)}> DELETE</button></td>
              <td>
                <UserModal/>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
        </tfoot>
      </table>

      
    </div>
    <div>
      {/* Pagination */}
      
      <Pagination color="success" total={totalPages} initialPage={1} 
              onChange={(page) => onPageChange(page)}/>
    </div>
    </>
  );
};
  

export default FetchUsers

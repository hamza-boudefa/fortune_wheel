import React, { useState, useEffect } from 'react';
import axios from 'axios';

function KeywordsManager() {
  const [keywords, setKeywords] = useState({ id: null, keywords: '' });
  const [pageId, setPageId] = useState({ id: null, pageId: '' }); // New state for page ID
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [update, setUpdate] = useState(false);
  const [updateId, setUpdateId] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Fetch keywords
    axios.get('http://localhost:3000/getKeyword')
      .then(response => {
        if (response.data) {
          setUpdate(true);
          setKeywords(response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching keywords:', error);
        setLoading(false);
      });

    // Fetch page ID
    axios.get('http://localhost:3000/getPageId')
      .then(response => {
        if (response.data) {
          setUpdateId(true);
          setPageId(response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching page ID:', error);
        setLoading(false);
      });
  }, []);

  const handleKeywordsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = update ? `http://localhost:3000/updateKeyword/${keywords.id}` : 'http://localhost:3000/addKeyword';
      const method = update ? 'put' : 'post';
      const response = await axios[method](url, { keywords });
      setKeywords(response.data);
      setMessage('Keywords updated successfully');
    } catch (error) {
      console.error('Error updating keywords:', error);
      setMessage('An error occurred while updating keywords.');
    }
    setLoading(false);
  };

  const handlePageIdSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = updateId ? `http://localhost:3000/updatePageId/${pageId.id}` : 'http://localhost:3000/addPageId';
      const method = updateId ? 'put' : 'post';
      const response = await axios[method](url, { pageId });
      setPageId(response.data);
      setMessage('Page ID updated successfully');
    } catch (error) {
      console.error('Error updating page ID:', error);
      setMessage('An error occurred while updating page ID.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Manage Keywords and Page ID</h2>
      {loading && <span className="loader"></span>}
      
      {/* Keywords form */}
      <form onSubmit={handleKeywordsSubmit}>
        <div>
          <label htmlFor="keywords">Keywords:</label>
          <input 
            type="text" 
            id="keywords" 
            value={keywords.keywords || ''} 
            onChange={(e) => setKeywords({ ...keywords, keywords: e.target.value })} 
          />
        </div>
        <button type="submit">Save Keywords</button>
      </form>

      {/* Page ID form */}
      <form onSubmit={handlePageIdSubmit}>
        <div>
          <label htmlFor="pageId">Page ID:</label>
          <input 
            type="text" 
            id="pageId" 
            value={pageId.pageId || ''} 
            onChange={(e) => setPageId({ ...pageId, pageId: e.target.value })} 
          />
        </div>
        <button type="submit">Save Page ID</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default KeywordsManager;

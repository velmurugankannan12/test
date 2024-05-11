import React, { Component, createContext } from 'react';

const AppStateContext = createContext();

export class AppStateProvider extends Component {
  state = {
    addUserModal: false,
    editUserModal: false,
    deleteUserModal: false,
    editUserData: '',
    deleteBlogModal: false,
    editBlogData: '',
    deleteBlogData: '',
    addBlogModal: false,
    editBlogModal: false,
    blogMetaData: '',
    blogOgData: '',
    blogArtData: '',
    blogTwitterData: '',
    blogTableData: '',
    stickTop: false,
    comment: false,
    pubDate: Date.now(),
    preview: false,
    validationPop: false,
    author: '',
    category: '',
    sidebarMenu: false,
    uploadProgress: false
  };

  setAddUserModal = (e) => { this.setState({ addUserModal: e }) };
  setEditUserModal = (e) => { this.setState({ editUserModal: e }) };
  setDeleteUserModal = (e) => { this.setState({ deleteUserModal: e }) };
  setEditUserData = (e) => { this.setState({ editUserData: e }) };
  setDeleteBlogModal = (e) => { this.setState({ deleteBlogModal: e }) };
  setEditBlogData = (e) => { this.setState({ editBlogData: e }) };
  setAddBlogModal = (e) => { this.setState({ addBlogModal: e }) };
  setEditBlogModal = (e) => { this.setState({ editBlogModal: e }) };
  setDeleteBlogData = (e) => { this.setState({ deleteBlogData: e }) };
  setBlogMetaData = (e) => { this.setState({ blogMetaData: e }) };
  setBlogOgData = (e) => { this.setState({ blogOgData: e }) };
  setBlogArtData = (e) => { this.setState({ blogArtData: e }) };
  setBlogTwitterData = (e) => { this.setState({ blogTwitterData: e }) };
  setBlogTableData = (e) => { this.setState({ blogTableData: e }) };
  setStickTop = (e) => { this.setState({ stickTop: e }) };
  setComment = (e) => { this.setState({ comment: e }) };
  setPubDate = (e) => { this.setState({ pubDate: e }) };
  setPreview = (e) => { this.setState({ preview: e }) };
  setValidationPop = (e) => { this.setState({ validationPop: e }) };
  setAuthor = (e) => { this.setState({ author: e }) };
  setCategory = (e) => { this.setState({ category: e }) };
  setSidebarMenu = (e) => { this.setState({ sidebarMenu: e }) };
  setUploadProgress = (e) => { this.setState({ uploadProgress: e }) };
  
  

  render() {
    const { children } = this.props;
    const { editUserModal, deleteUserModal, addUserModal, editUserData, deleteBlogModal, editBlogData, addBlogModal, deleteBlogData, editBlogModal, blogMetaData, blogArtData, blogOgData, blogTwitterData, blogTableData, stickTop, comment, pubDate, preview, validationPop, author, category, sidebarMenu, uploadProgress } = this.state;

    return (
      <AppStateContext.Provider
        value={{
          addUserModal, editUserModal, deleteUserModal, editUserData, deleteBlogModal, editBlogData, addBlogModal, deleteBlogData, editBlogModal, blogMetaData, blogArtData, blogOgData, blogTwitterData, blogTableData, stickTop, comment, pubDate, preview, validationPop, author, category, sidebarMenu, uploadProgress,

          setAddUserModal: this.setAddUserModal, setEditUserModal: this.setEditUserModal, setDeleteUserModal: this.setDeleteUserModal, setEditUserData: this.setEditUserData, setDeleteBlogModal: this.setDeleteBlogModal, setEditBlogData: this.setEditBlogData, setAddBlogModal: this.setAddBlogModal, setDeleteBlogData: this.setDeleteBlogData, setEditBlogModal: this.setEditBlogModal, setBlogMetaData: this.setBlogMetaData, setBlogArtData: this.setBlogArtData, setBlogOgData: this.setBlogOgData, setBlogTwitterData: this.setBlogTwitterData, setBlogTableData: this.setBlogTableData, setStickTop: this.setStickTop, setComment: this.setComment, setPubDate: this.setPubDate, setPreview: this.setPreview, setValidationPop: this.setValidationPop, setAuthor: this.setAuthor, setCategory: this.setCategory, setSidebarMenu: this.setSidebarMenu, setUploadProgress: this.setUploadProgress
        }}
      >
        {children}
      </AppStateContext.Provider>
    );
  }
}

export default AppStateContext
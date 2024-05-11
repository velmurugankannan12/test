import { toast } from 'react-toastify';

export const errorNotify = ( msg ) => {

    toast.dismiss();
    toast.error( msg, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        pauseOnFocusLoss: false,
        theme: 'colored',
        containerId: "home_toast"
    } );
}

export const offlineInfo = (msg) => {

    toast.loading(msg, {
        toastId: "customId",
        theme: "colored",
        position: "top-center",
        containerId: "home_toast",
        type: 'error'
    })
}

export const onlineInfo = ( msg ) => {
    toast.update( "customId", { render: msg, type: "success", containerId: "home_toast", isLoading: false } );
    toast.dismiss( "customId" );

}
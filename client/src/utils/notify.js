import { toast } from 'react-toastify';


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
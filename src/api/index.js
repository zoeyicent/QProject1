// import something here
import axios from 'axios';
import Vue from 'vue';
import store from 'src/store'

// import vue from 'vue';
export default { 
	Vue : Vue,

	fnEncrypt: function (Data, UserName) {
		/*
			Encrypt data json
			Untuk ke laravel (cRouter.php)
			Note : Hasil Encrypt harus sama di file cRouter.php
		*/		
		var DataEncrypt = Data;
		    DataEncrypt = DataEncrypt.split('')
		         .reverse()
		         .join('');
		    // a = a.reverse();		         
		    DataEncrypt = btoa(DataEncrypt);		
		return DataEncrypt;
		// console.log(btoa(a));
		// console.log(atob(btoa(a)));
	},

	fnDecrypt: function (Data, UserName) {		
		/*
			Decrypt data json
			Dari laravel (cRouter.php)
			Note : Hasil Decrypt harus sama di file cRouter.php
		*/	
		var DataDecrypt = Data;
		    DataDecrypt = atob(DataDecrypt);	
		    // console.log('DataDecrypt atob',DataDecrypt);	
		    DataDecrypt = DataDecrypt.split('')
		         .reverse()
		         .join('');
			// console.log('DataDecrypt Reverse',DataDecrypt);
		return JSON.parse(DataDecrypt);
	},

	fnEncryptParam: function (DataParms, UserName) {
		var DataJSon = JSON.stringify(DataParms);
		var ObjParms = new Object;
			ObjParms['Data'] = this.fnEncrypt(DataJSon);
		return ObjParms;
	},

	async fnLoginData (DataParms, UserName) {
		var params = this.fnEncryptParam(DataParms); 
        var Address = process.env.API + 'login';
		try {
			const response = await axios.get(Address, { params: params, withCredentials: true } )
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	async fnRequestData (DataParms, UserName) {	
		
		var AppName = store.state.App.AppName;
		
		DataParms['AppUserName'] = localStorage.getItem(AppName+'-name');
		DataParms['AppToken'] = localStorage.getItem(AppName+'-token');
		DataParms['AppDateInfo'] = localStorage.getItem(AppName+'-dateInfo');
		DataParms['AppName'] = AppName;

		var params = this.fnEncryptParam(DataParms); 
        var Address = process.env.API + 'getData';

		try {
			const response = await axios.get(Address, { params: params, withCredentials: true } )			
			return this.fnDecrypt(response.data, '');
		} catch (error) {
			throw error;
		}
	},

	async fnPostData (DataParms, UserName) {	
		
		// var AppName = store.state.App.sAppInfo.Name;

		// DataParms['name'] = localStorage.getItem(AppName+'-name');
		// DataParms['token'] = localStorage.getItem(AppName+'-token');
		// DataParms['dateInfo'] = localStorage.getItem(AppName+'-dateInfo');
		// DataParms['AppName'] = AppName;

        var params = this.fnEncryptParam(DataParms); 
        var Address = process.env.API + 'postData';

		try {
			const response = await axios.post(Address, { params: params, withCredentials: true } )
			// const response = await axios.get(Address, { params: params } )
			return this.fnDecrypt(response.data, '');
		} catch (error) {
			throw error;
			// return {data: {sukses: false, title: 'Fail', message: 'fnPostData Fail ' + error}}
		}
	},

	async fnPostFile (DataParms, UserName) {		
        var params = DataParms; 
        var Address = process.env.API + 'postFile';
		try {
			const response = await axios.post(Address, params )
			return response.data;
		} catch (error) {
			throw error;
		}
	},

}



<script>

	import router from 'src/router'
	import store from 'src/store'

	export default {
/*
	Audio, Ball, Bars, Circles, Comment, Cube, Dots, Facebook, 
	Gears, Grid, Hearts, Hourglass, Infinity, Ios, Mat, Oval, 
	Pie, Puff, Radio, Rings, Tail
*/

		loading: {

			startLoadingView(form, 
							 loadingMessage="Loading Data... Please Wait...", 
							 SpinnerType="audio", 
							 loadingColor="white") {

				form.$q.loading.show({
					spinner: `q-spinner-${SpinnerType}`,
					spinnerColor: loadingColor,
					spinnerSize: 140,
					messageColor: loadingColor,
					message: loadingMessage
				});
			},

			endLoadingView(form) {			
				form.$q.loading.hide();
			},

			async loadData(form, 
						   loadingMessage, 
						   spinnerType, 
						   loadingColor, 
						   callBack) {
				// console.log('loadData Check Status Active : ', form.$q.loading.isActive);
				// if (form.$q.loading.isActive) {
				// 	console.log('Begin looping');
				// 	var i = 1; var status = true;
				// 	while (status) {
				// 		console.log('looping status: ', form.$q.loading.isActive);
				// 		status = form.$q.loading.isActive;
				// 		i++;
				// 		if (i > 10000) {
				// 			console.log('waktu habis xxxxxxxxxxxxxx', form.$q.loading.isActive);
				// 			break;
				// 		}
				// 	}
				// 	console.log('End looping status: ', form.$q.loading.isActive);
				// }

				this.startLoadingView(
					form, 
					loadingMessage = loadingMessage === "" ? "Loading Data... Please Wait..." : loadingMessage, 
					spinnerType = spinnerType === "" ? "audio" : spinnerType, 
					loadingColor = loadingColor === "" ? "white" : loadingColor );

				await callBack(); 

				this.endLoadingView(form);
			},

			async login(form, callBack) {
				this.startLoadingView(form, 'Prosses login... Please wait...' );
				await callBack(); 
				this.endLoadingView(form);
			},

			async checking(callBack) {
				await callBack();
			}
		},
 
 		messaging: {
			async loadMsg(form, mode) {

				var Title = '';
				var Msg = '';
				switch (mode) {
					case "1":
						Msg = 'Are you sure want to save this record ?'
						Title = 'Save'
						break;
					case "2":
						Msg = 'Are you sure want to update this record ?'
						Title = 'Update'
						break;
					case "3":
						Msg = 'Are you sure want to delete this record ?'
						Title = 'Delete'
						break;
					case "7":
						Msg = 'Are you sure want to confirm/approved this record ?'
						Title = 'Confirmation'
						break;
				}

				return await form.$q.dialog({
							title: Title,
							// message: 'Are you sure want to save this record ?',
							message: Msg,
							ok: 'Yes',
							cancel: 'No'
						}).then(() => {
							return true;
						}).catch(() => {
							return false;
						});

			},
			async confirm(form, Title, message) {

				return await form.$q.dialog({
							title: Title,
							// message: 'Are you sure want to save this record ?',
							message: Msg,
							ok: 'Yes',
							cancel: 'No'
						}).then(() => {
							return true;
						}).catch(() => {
							return false;
						});

			},	
		},


	    login( {form , user , pass , keep} ) {
			this.loading.login( form ,
				async () => {
					await store.dispatch('App/doAppLogin', { 
											user:user,
											pass:pass,
											keep:keep
					}).then(
						function() {
    						var AppName = store.state.App.AppName + '-name';
							var UserInfo = store.state.App.AppUser; 
							if (UserInfo.flag) {
								if (localStorage.getItem(AppName)) {  
									router.push({name : 'mainMenu'});
								} else {								
									form.$q.dialog({ title: 'Fail', 
													 message: 'No information to get, within your login' });
								}
							} else {
								form.$q.dialog({ title: 'Fail', 
												 message: UserInfo.message });
							}
						}
					).catch(
						function (error) {
							form.$q.notify('' + error );
						}
					);					
				}
			);	

		},

		checkLogin() {

			store.dispatch('App/doAppCheckLogin').then(
				function() {
					var AppName = store.state.App.AppName + '-name';
					var UserInfo = store.state.App.AppUser; 
					if (UserInfo.flag) {
						if (localStorage.getItem(AppName)) {  
							router.push({name : 'mainMenu'});
						} else {
							router.push({name : 'login'});
						}
					} else {
						router.push({name : 'login'});
					}						
				}
			)

		},

		logout() {
			// alert('logout');
			store.dispatch('App/doAppLogout');
			router.push({name : 'login'});		
			router.go();		
		},


		async loadMenuTree(form, frmID) {
			await this.loading.loadData( form , 'Loading Menu... Please Wait...', 'Hourglass', '', 
				async () => {

					await store.dispatch('App/doAppMenuTree', frmID).then(
						function() {							
							var RouteInfo = store.getters['App/getAppForms'][frmID].ListMenu.DataRute;
								// console.log(RouteInfo);
						    let { routes } = router.options;
								// console.log(routes);
						    // let routeData = routes.find(r => r.path + '/' === '/MainMenu/');
						    let routeData = routes.find(r => r.path === '/');
								// console.log(routeData);	
								// console.log(routeData.children.length);
								// console.log(RouteInfo.length);			
							/* 
							   if dibawah ini utk menghandle 
							   kalau webnya REFRESH or BACK BUTTON 
							*/
							if (routeData.children.length != RouteInfo.length) {
							    routeData.children = RouteInfo
						    	router.addRoutes([routeData]);
							}

						}
					).catch(
						function (error) {
							form.$q.notify('' + error );
						}
					);	

				}
			);

		},


		actionForm ({form, frmID, mode}) {			
			store.dispatch('App/doAppMenuAction', {
				frmID: frmID, 
				mode: mode
			});

			// console.log("Auth - actionForm , this :", form)
			/*o = Object, k = Key*/

			/*	
				Begin Proses Looping data (Store)
				Example : TBLMNU.Forms 
			*/			
			var o = store.state.App.AppForms[frmID].Forms;
			// console.log('Auth - actionForm , Object :', o)
			for (var k in o) {
				// console.log('object ', k)
				this.clearFormObject({
					form: form,
					frmID: frmID, 
					frmObj: k, 
					mode: mode					
				});
			}
			/*	
				End Proses Looping data (Store)
				Example : TBLMNU.Forms 
			*/			

		},


		async setupForm ({form, formId, CommandClick}) {			
			/*
				setupForm --> only first time				
				{
					(setAppForms_Data CommandClick) is a function, 
					make it, insert into the store 
					
					(doAppLoadObject frmTBLMNU)

					Ex. : 
						AppForms.TBLMNU.CommandClick
						AppForms.TBLMNU.Forms.frmTBLMNU

				}
	
			*/

	    	var frmID = store.getters['App/getAppModules'].GetMenuID(form.$route.name);	    	
	    	form[formId] = frmID;
	    	store.commit('App/setAppForms_Data', {
				id: frmID,
				path:'CommandClick',
				data: CommandClick
	    	});

			await this.loadFormOject({
				form: form,
				frmID: frmID,			
				frmObj: 'frm' + frmID,	
				method: 'ObjectData' 	
			});

		},


		async loadFormOject({form, frmID, frmObj, method}) {

			await store.dispatch('App/doAppLoadObject', { 
						frmID: frmID, 
						frmObj: frmObj, 
						method: method 
				}).then( function() {
	    	
	    		}).catch( function (error) {
						form.$q.notify('Error Loading Form Object ' + error );
				});
	    	
	    	/*
				Tidak pakai loading.loadData
				Karene bentrok dengan LoadDataGrid
	    	*/

			// await this.loading.loadData( form , 'Loading Form Object... Please Wait...', 'Gears', '', 
			// 	async () => {

			// 	}
			// );

		},

		clearFormObject({form, frmID, frmObj, mode}) {
			/* f = Form, k = Key, o = Object */	
			if (mode === "3" || 	// Mode Delete
				mode === "4" || 	// Mode Save
				mode === "7" || 	// Mode Confirm / Approved
				mode === "8" || 	// Mode Print
				mode === "9") {		// Mode Export To Excel
				return;
			}
			/****************************************************/
			/****************************************************/
			/****************************************************/
			var f = store.state.App.AppForms[frmID].Forms[frmObj];
			for (var k in f) {  // Begin Looping Object
				var o = f[k];
				// Begin Clear Value
				switch (o.Tipe) {
					case "cmb":
						/* ini atur nya ada di php "fnCrtObjCmb" */
						// o.Value = o.Jenis === 'MULTIPLE' ? [] : ''; 
						o.Value = o.Jenis === 'MULTIPLE' ? [] : o.DefaultValue; 
						break;
					case "rad":
						/* ini atur nya ada di php "fnCrtObjRad" */
						// o.Value = o.Jenis === 'toggle' ? [] : ''; 
						o.Value = o.Jenis === 'toggle' ? [] : o.DefaultValue; 
						break;
					case "tog":
						o.Value = o.DefaultValue;
						break;
					case "pop":
						o.Pops[o.PopCode].Value = '';
						o.Pops[o.PopDesc].Value = '';
						o.Pops[o.PopCode+o.PopDesc].Value = '';
						o.Value = '';
						break;
					case "grd":
						o.Value = '';
						o.Grid.Rows.data = [];
						// console.log(o);
						break;
					case "num":
						o.Value = '0';
						break;
					default:
						o.Value = '';
						break;
				}
				// End Clear Value
				
				// Begin Set ReadOnly Mode (Merubah Background Object Jadi ABU-ABU )
				if (o.Mode == mode) {
					o.ReadOnly = true;
				} else if (o.Mode == '3') { //--> Object Mode
					o.ReadOnly = true;
				} else if (mode == '6') { // --> Tampilan Mode
					o.ReadOnly = true;
				} else {
					o.ReadOnly = false;
				}
				// End Set ReadOnly Mode (Merubah Background Object Jadi ABU-ABU )
				
				// Begin Reset Validation Vue
				if (mode==="5") { 
					var pObj = ('pObj.Code').split('.');
					var ObjForm = form.$findObj(form.$children, '$children', pObj, k);
					if (ObjForm != undefined) {
						ObjForm.$v.ObjADR.$reset();
					}
				}
				// End Reset Validation Vue

			} // End Looping Object

			// switch (mode) {
			// 	case "1": // Add
			// 	case "2": // Edit
			// 	case "6": // View			
			// 		// FormLocal.$nextTick(() => {
			// 		// 	this.focusObject(FormLocal,'');
			// 		// })
			// 		break;
			// 	case "5":
			// 		// FormLocal.$children[child].$v.ObjADR.$reset();
			// 		// console.log(form);
			// 		// this.$findObj(form, 
			// 		// 			'children', 'pObj', Selection);
			// 		break;
			// 	default:
			// 		break;
			// }

		},




		async fillFormObject({form, frmID, frmObj, method}) {

			var Saya = this;


			await this.loading.loadData( form , 'Filling Your Form Data.... Please Wait...', 'Gears', '', 
				async () => {

					await store.dispatch('App/doAppFillObject', { 
							  frmID: frmID, 
							  frmObj: frmObj, 
							  method: method, 
							  dataParams: store.getters['App/getAppForms'][frmID].Grid.RowData
							}).then( function(response) {
								if (response) {
				    				if (!response.success) {
										form.$q.notify(response.message);  
				    					return;
				    				}
								}			    				
			    				var Data = response.data;
			    				if (Data.length==0) {
			    					// Tidak ada data;
									form.$q.notify('Data not found, please refresh the grid!');  
			    					return;
			    				}

				    		}).catch(function (error) {
								form.$q.notify('error Fill Form ' + error );  
			    			});

				}
			);


		},

		async fillFormObjectFromGrid({form, frmID, frmObj, data, mode}) {

	    	this.clearFormObject({
	    		form: form, 
	    		frmID: frmID, 
	    		frmObj: frmObj,
	    		data: data, 
	    		mode: mode});

			var f = store.state.App.AppForms[frmID].Forms[frmObj];
			// console.log('form : ' + frmObj + ' ',f);
			for (var k in f) {  // Begin Looping Object

        		var o = f[k];
        		// console.log(k + ' : ' + data[k], o);
		        var Nilai = data[k] == null ? '' : data[k];
		        if (typeof(Nilai) === "string") {
		            Nilai = Nilai.trim();
		        }
		        // console.log('Object : ', k + (o.Tipe))

		        switch (o.Tipe) {
		            case "num":
		                o.Value = Nilai; 
		                break;
		            case "cmb":
		            case "rad":
		                if (o.Jenis === 'toggle' || o.Jenis === 'MULTIPLE') {
		                    if (Array.isArray(Nilai)) {
		                        o.Value = Nilai; 
		                    } else {
		                        o.Value = Nilai.split(''); 
		                    }
		                } else {
		                    o.Value = String(Nilai); 
		                }
		                break;  
		            case "dtp":
		                var Nilai = Nilai;
		                if (Nilai=="") {
		                    o.Value = "";
		                } else {
		                    o.Value = Nilai.slice(0,4)+'-'+Nilai.slice(4,6)+'-'+Nilai.slice(6,8);
		                }
		                break;
		            case "pop":
		                o.PopSetValue({
		                    flag: true, 
		                    iy: Nilai, 
		                    code: data[o.PopCode] == null ? '' : data[o.PopCode], 
		                    desc: data[o.PopDesc] == null ? '' : data[o.PopDesc],
		                    data: {}                   
		                });
		                break;
		            case "fle":
		                o.Value = 'tempVal';
		                o.FileValue = Nilai.length == 0 ? 'tempVal' : Nilai;
		                break;
		            default:
		                o.Value = Nilai; 
		                break;
		        }				

			} // End Looping Object


		},


		validationFormObject({form, frmID, frmObj}) {
			/* f = Form, k = Key, o = Object */	
			var f = store.state.App.AppForms[frmID].Forms[frmObj];
			var gagal = false;
			for (var k in f) {  // Begin Looping Object
				var o = f[k];
				var pObj = ('pObj.Code').split('.');
				var ObjForm = form.$findObj(form.$children, '$children', pObj, k);
				if (ObjForm != undefined) {
					ObjForm.touch();
					if (ObjForm.$v.ObjADR.$error) {
						gagal = true;
					}
				}
			} // End Looping Object
			return gagal;
		},

		async saveData({form, frmID, frmObj, method}) {

			var Data = new Object;
			var mode = store.state.App.AppForms[frmID].Properties.modeAction;
			// console.log('auth - saveData , mode : ', mode);
			if (mode!="3" && mode!="7") {
				if (this.validationFormObject({
						form: form, 
						frmID: frmID, 
						frmObj: frmObj
					})) {

					form.$q.notify('Please review fields again!'); 
					return;
				}

				var o = store.state.App.AppForms[frmID].Forms;
				// console.log('Auth - actionForm , Object :', o)
				for (var k in o) { // Begin Looping Object Forms
					var f = o[k];
					Data[k] = {}
					for (var fk in f) {  // Begin Looping Object
						var fo = f[fk];
						switch (fo.Tipe) {
							case "dtp":
								// console.log(fo.Value.substring(0,10).replace(/[-]+/g,''));
								Data[k][fo.Code] = fo.Value.substring(0,10).replace(/[-]+/g,'');
								break;
							default:
								Data[k][fo.Code] = fo.Value;
								break;
						}
					} // End Looping Object
				} // End Looping Object Forms
				console.log(Data);				
			} else {
				Data['frm'+frmID] = store.state.App.AppForms[frmID].Grid.RowData;
			}

			var ConfirmationSaving = await this.messaging.loadMsg(form, mode);
			if (!ConfirmationSaving) { return }

			var Saya = this;
			await this.loading.loadData( form , 'Doing Your Request, Please Wait...', 'Gears', '', 
				async () => {
					await store.dispatch('App/doAppSaveData', { 
							  frmID: frmID, 
							  method: method, 
							  mode: mode,
							  dataParams: Data
							}).then( 
								async function(response) {
									if (response.success) {
										if (store.getters['App/getAppForms'][frmID].Grid) {
											form.$q.notify({color: 'positive',message: response.message});
											if (mode != "1") {
												store.getters['App/getAppForms'][frmID].CommandClick('5');
											}
											await store.getters['App/getAppForms'][frmID].Grid.LoadDataGrid();
										} else {
											form.$q.notify({color: 'positive',message: response.message});
										}
										if (mode == "1") {
											var o = store.state.App.AppForms[frmID].Forms;
											// console.log('Auth - actionForm , Object :', o)
											for (var k in o) {
												// console.log('object ', k)
												Saya.clearFormObject({
													form: form,
													frmID: frmID, 
													frmObj: k, 
													mode: "5"					
												});
											}							
										} 
									} else {							
										console.log('[error] ' + response.message)
										form.$q.notify(response.message);
									}
								}
							).catch(function (error) {
								form.$q.notify('error CRUD database ' + error );  
			    			});

				}
			);				

		},

		async saveDataDetail({form, frmID, frmObj, frmGridPath, mode}) {

			var Data = new Object;
			// console.log('auth - saveDataDetail , mode : ', mode);
			if (mode!="3" && mode!="7") {
				if (this.validationFormObject({
						form: form, 
						frmID: frmID, 
						frmObj: frmObj
					})) {

					form.$q.notify('Please review fields again!'); 
					return;
				}

				var f = store.state.App.AppForms[frmID].Forms[frmObj];
				// console.log('Auth - actionForm , Object :', o)
				for (var k in f) { // Begin Looping Object Forms
					var o = f[k];
					switch (o.Tipe) {
						case "pop":
							Data[k] = o.Value;
							Data[o.PopCode] = o.Pops[o.PopCode].Value;
							Data[o.PopDesc] = o.Pops[o.PopDesc].Value;
							break;
						default:
							Data[k] = o.Value;
							break;
					}

				} // End Looping Object Forms
				// console.log('DataDetail XXXXX => ', Data)

				// console.log(Data);				
			} 

			var ConfirmationSaving = await this.messaging.loadMsg(form, mode);
			if (!ConfirmationSaving) { 
				return {flagConfirm: false}; 
			}

			// console.log('DataDetail => ', Data)
			// console.log('DataDetail => ', frmDetail);

			var T = await store.dispatch('App/doAppGetPath', {
						frmID: frmID, 
						path: 'Forms.'+frmGridPath
					});

			var GData = T.Grid.Rows.data;
			var GD = Object.keys(GData).map(function (key) { return GData[key]; });

			if (mode=="1" ) {
				GD.push(Data);
			} else if (mode=="2" ) {
				GD[T.Grid.RowData.__index] = Data;
			} else if (mode=="3" ) {
				GD.splice(T.Grid.RowData.__index,1);
			}

	    	store.commit('App/setAppForms_Data', {
				id: frmID,
				path:'Forms.'+frmGridPath+'.Grid.Rows.data',
				data: GD
	    	});
	    	T.Value = GD;

			if (mode=="1" || mode=="2") {
		    	this.clearFormObject({
		    		form: form, 
		    		frmID: frmID, 
		    		frmObj: frmObj, 
		    		mode: '5'});				
			}


			return {flagConfirm: true}; 

		},


	}

	// export default auth;

</script>


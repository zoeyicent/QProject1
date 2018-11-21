<script>
	// import Vue from 'vue'
	// import Vuex from 'vuex'

	import router from 'src/router'
	import store from 'src/store'
	// import { mapGetters, mapActions } from 'vuex';
	// import { createNamespacedHelpers } from 'vuex';
	// const { mapGetters, mapActions } = createNamespacedHelpers('User');
	// console.log(localStorage);
	// console.log(process);

	export default {
	// const auth = function(myForm) {
	// 	return {
		// ...mapGetters('User',['gUserLoginInfo']),
		// ...mapActions('User',['aUser_BtnLogin','aUser_CheckLogin','aUser_XXX']),
	    // namespaced: true,
	    // myForm: this,
		loading: {
			async loadData(form, callBack) {
				form.$q.loading.show(
					{message: 'Some important process is in progress. Hang on...'}
				);			
				// console.log('1111')
				await callBack(); 
				form.$q.loading.hide();
				// console.log('3333')
			},
			async fillForm(form, callBack) {
				form.$q.loading.show(
					{message: 'Some important process is in progress. Hang on...'}
				);			
				// console.log('1111')
				await callBack(); 
				form.$q.loading.hide();
				// console.log('3333')
			},			
			async checking(callBack) {
				await callBack();
			}
		},

	    login(form) {
			this.loading.loadData(form,
				async () => {
					await store.dispatch('User/doUserLogin', 
						{ Name:form.TUUSER , Pass:form.TUPSWD} 
					).then(
						function(response) {
							var UserInfo = store.state.User.sUserLoginInfo;
							if (UserInfo.FlagLogin) {
								form.$router.push({name : 'mainMenu'});
							} else {
								// console.log('222')
								form.$q.dialog({ title: 'Fail', message: UserInfo.MsgLogin });
							}
						}
					).catch(
						function (error) {
							console.log(error);
						}
					);					
				}
			);	

		},


		checkLogin(tipe) {
			var me = this;
			// console.log(this);
			store.dispatch('User/doUserCheckLogin').then(
				function() {
					// console.log(router);
					var UserInfo = store.state.User.sUserLoginInfo;
					if (tipe=="login") {
						if (UserInfo.FlagLogin) {
							router.push({name : 'mainMenu'});
						} else {
							router.push({name : 'login'});
						}					
					} else if (tipe=="menu") {
						if (UserInfo.FlagLogin) {				
							/* Load List Menu dan Route Menu */			
							store.dispatch('Menu/doMenuLoadTree');
							store.dispatch('Menu/doMenuLoadRoute').then(
								function() {
									var RouteInfo = store.state.Menu.sRoute;
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
									// console.log(routeData.children.length);
									// console.log(routes);

								}
							)						
						} else {
							me.logout();
						}					
					}
				}
			) 			
		},

		logout() {
			// alert('logout');
			store.dispatch('User/doUserLogoff')
			router.push({name : 'login'});				
		},


		loadFormObject(FormLocal) {
			/*
			 Tiap Local File harus ada variable frmObj
			 */
			store.dispatch('Menu/doMenuObjectData', 
						{ Name:FormLocal.frmName , params:'' } ).then(
	    			function() {
	    				FormLocal.frmObj = store.state.Menu.sMenuObjectData[FormLocal.frmName];
	    			}
	    		);		
		},


		// fillFormObject(FormLocal, Name) {

		// 	this.loading.loadData(FormLocal,
		// 		async () => {
		// 			await store.dispatch('Menu/doMenuFillData', { 
		// 					  Name: Name , 
		// 					  params: store.state.Grid.sGridSelection[Name] 
		// 					  // ini ada di ObjGrid (Sudah Set disana)
		// 					} ).then(
		// 		    			function(Data) {
		// 							var f = FormLocal.frmObj;
		// 							for (var k in f) {
		// 								var o = f[k];
		// 								o.Value = Data[k]; 
		// 							}
		// 		    			}
		// 	    			).catch(
		// 						function (error) {
		// 							console.log(error);
		// 						}
		// 					);	

		// 		}
		// 	);			
		// },

		async fillFormObject(FormLocal) {
			/*
			 Tiap Local File harus ada variable frmObj
			 */
			 // console.log(store.state.Grid.sGridSelection[Name]);
			await store.dispatch('Menu/doMenuFillData', { 
					  Name: FormLocal.frmName , 
					  params: store.state.Grid.sGridSelection[FormLocal.frmName] 
					  /* sGridSelection --> ini ada di ObjGrid (Sudah Set disana)
					  						dengan memanggil doGridSelection */
					} ).then(
		    			function(Data) {
							var f = FormLocal.frmObj;
							for (var k in f) {
								var o = f[k];
								switch (o.Tipe) {
									case "num":
										o.Value = Data[k]; 
										break;
									default:
										o.Value = Data[k].trim(); 
										break;
								}
								// console.log(k, ' (' + o.Value + ')');
							}
		    			}
	    		);		

		},


		clearFormObject(FormLocal, Mode) {
			/*
				f = Form, k = Key, o = Object
			 */					    	
			var f = FormLocal.frmObj;
			for (var k in f) {
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
					case "num":
						o.Value = '0';
						break;
					default:
						o.Value = '';
						break;
				}
				// End Clear Value
				
				// Begin Set ReadOnly Mode
				if (o.Mode == Mode) {
					o.ReadOnly = true;
				} else if (o.Mode == '3') { //--> Object Mode
					o.ReadOnly = true;
				} else if (Mode == '6') { // --> Tampilan Mode
					o.ReadOnly = true;
				} else {
					o.ReadOnly = false;
				}
				// End Set ReadOnly Mode
				// console.log(' (' + k + ') ' + o.Name);
				// console.log(FormLocal.$children);
				// FormLocal.$children[child].$v.ObjADR.$error

			}

		},

		messaging: {
			loadMsg(FormLocal, callBack) {
				var Saya = this;

				var Msg = '';
				switch (FormLocal.localFormAction.mode) {
					case "1":
						Msg = 'Are you sure want to save this record ?'
						break;
					case "2":
						Msg = 'Are you sure want to update this record ?'
						break;
					case "3":
						Msg = 'Are you sure want to delete this record ?'
						break;
				}

				FormLocal.$q.dialog({
					title: 'Save',
					// message: 'Are you sure want to save this record ?',
					message: Msg,
					ok: 'Yes',
					cancel: 'No'
				}).then(() => {
					console.log(Saya);
					callBack(); 
					// FormLocal.$q.notify('Ok...Ok...')
				}).catch(() => {
					FormLocal.$q.notify('Cancel...XXX...')
				});

				// console.log('3333')
			},
		},

	    saveData(FormLocal) {
	    	// Begin Check Object Required
	    	var gagal = false;
			// console.log('children ', FormLocal.$children);
			for (let child in FormLocal.$children) {
				// console.log('looping ' + child + ' : ', typeof(FormLocal.$children[child].ObjADR));
				if (typeof(FormLocal.$children[child].ObjADR) != 'undefined') {
					// console.log('masuk ' + child)
					FormLocal.$children[child].touch();
					if (FormLocal.$children[child].$v.ObjADR.$error) {
						gagal = true;
					}
				}				
			}
			if (gagal) { 
				FormLocal.$q.notify('Please review fields again!'); 
				return;
			}
	    	// End Check Object Required


			this.messaging.loadMsg(FormLocal,
				async () => {
					// console.log(FormLocal.frmName);
					var params = new Object;
						params['Controller'] = 'c' + FormLocal.frmName;
						params['Method'] = 'SaveData';
						params['Form'] = FormLocal.frmObj;
						params['Mode'] = FormLocal.localFormAction.mode;

					await store.dispatch('Menu/doMenuSaveData', params).then(
						async function(response) {

							var params = new Object;
								params['Controller'] = 'c' + FormLocal.frmName;
								params['Method'] = 'LoadData';								
								params['page'] = store.state.Grid.sGridData[FormLocal.frmName].current_page;
								params['perPage'] = store.state.Grid.sGridData[FormLocal.frmName].per_page;
								await store.dispatch('Grid/doGridLoadData', params);

								// console.log('Berhasil -> ', store.state.Grid.sGridData[FormLocal.frmName] )
							FormLocal.$q.notify('Okkkk... ')
						}
					).catch(
						function (error) {
							console.log(error);
							FormLocal.$q.notify(error);
						}
					);					
				}
			);	

		},

		// }

	}

	// export default auth;

</script>


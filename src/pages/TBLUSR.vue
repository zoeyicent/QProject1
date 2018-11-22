<template>
  <div class="docs-table">
  	<div v-show="myForm.Properties.layout==='1'">
		<ObjGrid :frmID="frmID" />
  	</div>
  	<div v-show="myForm.Properties.layout==='2'" class="text-left q-ma-xs round dense row">
  		<div class="col-xs-12 col-md-6">
			<ObjADR 
				v-for="(Obj, index) in myForm.Forms['frm'+frmID]" 
				:pObj="Obj" :pFrmObj="'frm'+frmID"
				:key="index"
				v-if="Obj.Panel === 'Panel1' ? true : false"
			/>
			<q-btn color="green" label="Set Menu Access" @click="layoutModal=true" />
  		</div>
		<div class="col-xs-12 col-md-6">
			<ObjADR 
				v-for="(Obj, index) in myForm.Forms['frm'+frmID]" 
				:pObj="Obj" :pFrmObj="'frm'+frmID"
				:key="index"
				v-if="Obj.Panel === 'Panel2' ? true : false"
			/>		
  		</div>

		<q-modal 
			v-model="layoutModal"
			minimized
			no-backdrop-dismiss
			no-esc-dismiss
		>
			<q-modal-layout>
				<q-toolbar slot="header">
					<q-btn
						flat
						round
						dense
						@click="layoutModal = false"
						icon="reply"
						wait-for-ripple
					/>
					<q-toolbar-title>
						Access Menu
					</q-toolbar-title>
					<q-btn :disable="varreadonly" flat round dense icon="accessibility" @click="userModal=true">
						<q-tooltip anchor="top right" self="bottom left">
							<div><strong>Duplicate</strong></div>
						</q-tooltip>
					</q-btn>
					<q-btn :disable="varreadonly" flat round dense icon="select_all" @click="selectAll">
						<q-tooltip anchor="top right" self="bottom left">
							<div><strong>Select All</strong></div>
						</q-tooltip>
					</q-btn>
					<q-btn :disable="varreadonly" flat round dense icon="clear_all" @click="clearAll">
						<q-tooltip anchor="top right" self="bottom left">
							<div><strong>Clear All</strong></div>
						</q-tooltip>
					</q-btn>
				</q-toolbar>
				
				<q-list style="width: 500px; max-width: 90vw;">
					<q-item v-for="(item, index) in menulist" v-bind:key="index">
						<q-item-main class="myfont">
							<q-select 
								:readonly="varreadonly" 
								:inverted-light="varreadonly"
								:color="WarnaReadOnly"
								v-if="item.TMACES.length != 0 ? true : false" 
								:float-label="item.TMMENU" 
								v-model="item.HAKAKSES" multiple 
								:options="item.TMACES" />
							<div v-else style="font-weight: bold">{{item.TMMENU}}</div>
						</q-item-main>
					</q-item>
				</q-list>
			
			</q-modal-layout>
		</q-modal>

		<q-modal 
			v-model="userModal"
			minimized
			no-backdrop-dismiss
			no-esc-dismiss
		>
			<q-modal-layout>
				<q-toolbar slot="header">
					<q-toolbar-title>
						User List
					</q-toolbar-title>
					<q-btn
						flat
						round
						dense
						@click="userModal = false"
						icon="clear"
						wait-for-ripple
					/>			
				</q-toolbar>
				<div>
					XXX
				</div>
			</q-modal-layout>
		</q-modal>
  	</div>
  </div>
</template>

<script>

	import api from 'src/api'
	import auth from 'src/auth/auth.vue';
	import ADRObjs from '../components/ADRObj/main.js';
	import { mapGetters, mapMutations } from 'vuex';

	export default { 
  		components : ADRObjs,	
	    created () { 
	    	auth.setupForm({
	    		form: this,						// --> local this
	    		formId: 'frmID',  				// --> local variabel name 
	    		CommandClick: this.CommandClick
	    	});
	    },
		computed: {
			...mapGetters('App',['getAppForms']),
			myForm() {
				return this.getAppForms[this.frmID];
			},
			WarnaReadOnly() {
				return this.varreadonly ? 'grey-6' : 'primary';
			},	
		},	
		methods: {
			...mapMutations('App',['setAppForms_Data']),
			CommandClick: function (mode) {
				if (mode != "") {

					switch(mode) {
						case "1": // Add
							auth.actionForm({form: this, mode: mode});	
							this.loadQuery(mode);
					    	break;
					    case "6": // View
					    case "2": // Edit
					    	auth.fillFormObject({form: this, mode: mode})
							.then((response) => {
                                this.loadQuery(mode);
                            })
					    	break;
					    case "3": // Delete
					    	auth.saveData({
					    		form: this, 
					    		frmID: this.frmID, 
					    		frmObj: 'frm' + this.frmID,
					    		mode: '3'
					    	});
					    	return;
					        break;
						case "4": // Save

							// begin buat nembak data
							// let frmTBLUAM = new Object
							// 	frmTBLUAM['Tipe'] = 'Other'
							// 	frmTBLUAM['Code'] = 'TBLUAM'
							// 	frmTBLUAM['Value'] = this.menulist
							
							// let frmOther = new Object
							// 	frmOther['TBLUAM'] = frmTBLUAM
							// 	console.log(frmOther);

							// this.setAppForms_Data({
							// 	id: this.frmID,
							// 	path: 'Forms.frmTBLUAM',
							// 	data: frmOther})
							// end buat nembak data

							/*
								Code diatas juga bisa dipakai,
								Kalau mau simple, just like that.								
							*/
							this.setAppForms_Data({
								id: this.frmID,
								path: 'Forms.frmTBLUAM',
								data: {TBLUAM: {Tipe: 'Other',
											    Code: 'TBLUAM',
											    Value: this.menulist}}
							});

					    	auth.saveData({
					    		form: this, 
					    		frmID: this.frmID, 
					    		frmObj: 'frm' + this.frmID,
					    	})
					    	return;
					    	break;
					    case "5": // Cancel
							auth.actionForm({form: this, mode: mode});
					        break;
					}					
				}
			},
			loadQuery (Mode) {

				this.varreadonly = (Mode == '6') ? true : false

				var params = new Object;
					params['Controller'] = 'cTBLUSR';
					params['Method'] = 'getQuery';
					params['TUUSERIY'] = this.myForm.Forms['frm'+this.frmID].TUUSERIY.Value;

				api.fnRequestData (params, '')
				.then((response) => {
					this.menulist = response
				})
				.catch(() => {
					this.$q.notify({
						color: 'negative',
						position: 'top',
						message: 'Loading failed',
						icon: 'report_problem'
					})
				})
			},
			selectAll () {
				var mylist = this.menulist
				for (let i in mylist) {
					var eachlist = mylist[i].TMACES

					mylist[i].HAKAKSES = Object.keys(eachlist).map(function(key){
											return eachlist[key].value
										});
				}
			},
			clearAll () {
				var mylist = this.menulist
				for (let i in mylist) {
					mylist[i].HAKAKSES = []
				}
			},
		},			
		data () {
			return {
				frmID: 'TBLUSR',
				layoutModal: false,
				menulist: [],
				varreadonly: false,
				userModal: false,
	      	}
	    }
	}
</script>
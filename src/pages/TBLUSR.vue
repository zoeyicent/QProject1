<template>
  <div>

	<div v-show="localForm.tampilLayarPertama">	
		<ObjGrid 
			:pGridName="this.frmName" 
			@eForm="CommandClick"
		/>
	</div>

	<div v-show="!localForm.tampilLayarPertama" class="text-left q-ma-sm round dense row">
		<div v-if="loadingObject" class="col-12 col-md-6">
			<ObjADR 
				v-for="(Obj, index) in frmObj" 
				:pObj="Obj" 
				:key="index"
				v-if="Obj.Panel === 'Panel1' ? true : false"
			/>
			<q-btn color="green" label="Set Menu Access" @click="layoutModal=true" />
		</div>
		<div v-if="loadingObject" class="col-12 col-md-6">
			<ObjADR 
				v-for="(Obj, index) in frmObj" 
				:pObj="Obj" 
				:key="index"
				v-if="Obj.Panel === 'Panel2' ? true : false"
			/>
		</div>
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
</template>

<script>

	import api from 'src/api'
	import auth from 'src/auth/auth.vue';
	import ObjGrid from '../components/ADRObj/ObjGrid.vue';
	import ObjADR from '../components/ADRObj/ObjADR.vue';
	import { mapGetters, mapActions } from 'vuex';

	export default { 
		components : { ObjGrid, ObjADR },
  		name: 'TBLUSR',
	    created () { 
	    	this.localFormAction = this.$findTree(this.getMenuTree, this.$route.name).actionForm ;
			auth.loadFormObject(this);
			this.CommandClick (this.localFormAction.mode, 'VAEDXLP');
	    },
	    activated () {
			this.doMenuAction( {Mode: this.localFormAction.mode, Action: this.localFormAction} );
	    },
	    deactivated () {
			this.doMenuAction( {Mode: '', Action: this.localFormAction} );
	    },			    
		computed: {
	      	...mapGetters('Grid',['getGridData']),
			...mapGetters('Menu',['getMenuTree','getMenuObjectData']),
			loadingObject() {
	      		return this.frmObj.length === 0 ? false : true;
	      	},
			localForm () {
				return this.$localFormAction(this, '');
			},
			WarnaReadOnly() {
				return this.varreadonly ? 'grey-6' : 'primary';
			},
		},	
		methods: {
	      	...mapActions('Menu',['doMenuAction','doMenuSaveData']),
			CommandClick: function (Mode, HakAkses) {

				if (Mode != "") {
					switch(Mode) {
						case "1": // Add	
							this.loadQuery(Mode);
					    	break;
					    case "2": // Edit					    
							auth.fillFormObject(this, Mode)
							.then((response) => {
                                this.loadQuery(Mode);
                            })
					    	return;
					    	break;
						case "3": // Delete
					    	auth.saveData(this, Mode);
					    	return;
					        break;
						case "4": // Save
							this.frmOther = this.menulist;
					    	auth.saveData(this, this.localFormAction.mode);
					    	return;
					    	break;
					    case "5": // Cancel				
							auth.resetValidation(this);
							this.clearAll();
					        break;
						case "6": // View
							auth.fillFormObject(this, Mode)
							.then((response) => {
                                this.loadQuery(Mode);
                            })
					    	return;
					    	break;					        
					}
				}
				auth.clearFormObject(this, Mode);
				this.doMenuAction( {Mode: Mode, Action: this.localFormAction} );
			},
			loadQuery (Mode) {

				this.varreadonly = (Mode == '6') ? true : false

				var params = new Object;
					params['Controller'] = 'cTBLUSR';
					params['Method'] = 'getQuery';
					params['TUUSERIY'] = this.frmObj.TUUSERIY.Value;

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
				frmName: 'TBLUSR',
				frmObj: '', // frmObj berhubungan dengan auth.loadFormObject
				frmOther: '',
				localFormAction: { type: Object },
				layoutModal: false,
				menulist: [],
				varreadonly: false,
				userModal: false,
	      	}
		}
	}
</script>
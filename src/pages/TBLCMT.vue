<template>
  <div>  	

	<div v-show="localForm.tampilLayarPertama">
		<ObjGrid 
			:pGridName="this.frmName" 
			@eForm="CommandClick"
			/>
	</div>

	<div v-show="!localForm.tampilLayarPertama" class="text-left round dense ">
		<div v-if="loadingObject" class="q-ma-xs row">
	        <div class="col-sm-7">
		        <div class="row">
		        	<ObjADR :pObj="MENUIY" class="col-xs-6" />
		        	<!-- <ObjADR :pObj="frmObj.TCMENUIY" class="col-xs-5"/> -->
			        <!-- <ObjADR :pObj="LGTH" /> -->
		    	</div>
		        <div class="row">
			        <ObjADR :pObj="frmObj.TCDESC" class="col-xs-12" />
		    	</div>
	    	</div>	    
 		</div>
	</div>

  </div>
</template>

<script>

	import auth from 'src/auth/auth.vue';
	import ObjGrid from '../components/ADRObj/ObjGrid.vue';
	import ObjADR from '../components/ADRObj/ObjADR.vue';
	import { mapGetters, mapActions } from 'vuex';

	export default { 
  		components : { ObjGrid, ObjADR },	
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
			MENUIY() {
				if (this.frmObj.TCMENUIY.PopData != '') {
					console.log(this.frmObj.TCMENUIY.PopData);
					// this.frmObj.TMRLDT.Value = this.frmObj.TCMENUIY.PopData.TMRLDT; // Untuk isi field di bawahnya
				}
				return this.frmObj.TCMENUIY;
			}
		},	
		methods: {
	      	...mapActions('Menu',['doMenuAction','doMenuSaveData']),
			CommandClick: function (Mode, HakAkses) {
				
				if (Mode != "") {
					switch(Mode) {
					    case "1": // Add
					    	break;
					    case "2": // Edit					    
					    	auth.fillFormObject(this, Mode);
					    	return;
					    	break;
					    case "3": // Delete
					    	auth.saveData(this, Mode);
					    	return;
					        break;
					    case "4": // Save
					    	auth.saveData(this, this.localFormAction.mode);
					    	return;
					    	break;
					    case "5": // Cancel									
							auth.resetValidation(this);
					        break;
					    case "6": // View
					    	auth.fillFormObject(this, Mode);
					    	return;
					    	break;					        
					}
				}				
				
				auth.clearFormObject(this, Mode);
				this.doMenuAction( {Mode: Mode, Action: this.localFormAction} );
			},
		},			
		data () {
			return {
  				frmName: 'TBLCMT',
				frmObj : '', // frmObj berhubungan dengan auth.loadFormObject
				localFormAction: { type: Object },
	      	}
	    }
	}
</script>
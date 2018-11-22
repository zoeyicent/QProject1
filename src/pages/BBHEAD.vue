<template>
  <div class="docs-table">
  <!-- 
  	v-if akan merender ulang (re-create object ulang) 
  	kalau sudah re-create
  		akan mentrigger computed dan lain sebagainya
  -->
  	<div v-show="myForm.Properties.layout==='1'">
		<ObjGrid :frmID="frmID" />
  	</div>
  	<div v-show="myForm.Properties.layout==='2'" class="text-left q-ma-xs round dense row">
  		<div class="col-xs-12 col-md-5">
			<ObjADR 
				v-for="(Obj, index) in myForm.Forms['frm'+frmID]" 
				:pObj="Obj" :pFrmObj="'frm'+frmID"
				:key="index"
				v-if="Obj.Panel === 'Panel1' ? true : false"
			/>  	
  		</div>
  		<div class="col-xs-12 col-md-6">
			<ObjADR 
				v-for="(Obj, index) in myForm.Forms['frm'+frmID]" 
				:pObj="Obj" :pFrmObj="'frm'+frmID"
				:key="index"
				@eFormDetail="DetailCommandClick"
				v-if="Obj.Panel === 'Panel2' ? true : false"
			>
			<!-- {{ myForm.Forms['frmBBLINE'] }} -->
				<div class="q-ma-sm" >
					<ObjADR 
						v-for="(Obj, index) in myForm.Forms['frmBBLINE']" 
						:pObj="Obj" :pFrmObj="'frmBBLINE'"
						:key="index"
						v-if="Obj.Panel === 'Panel1' ? true : false"
					/>  	
				</div>
			</ObjADR>  	
			<ObjADR 
				v-for="(Obj, index) in myForm.Forms['frm'+frmID]" 
				:pObj="Obj" :pFrmObj="'frm'+frmID"
				:key="index"
				v-if="Obj.Panel === 'Panel3' ? true : false"
			/>  			
  		</div>

  	</div>
  </div>
</template>

<script>

	import auth from 'src/auth/auth.vue';
	import ADRObjs from '../components/ADRObj/main.js';
	// import { mapGetters, mapMutations, mapActions } from 'vuex';
	import { mapGetters } from 'vuex';
	export default { 
  		components : ADRObjs,	
	    created () { 
	    	auth.setupForm({
	    		form: this,						// --> local this
	    		formId: 'frmID',  				// --> local variabel name 
	    		CommandClick: this.CommandClick
	    	}).then(async () => {
		    	await auth.loadFormOject({
		    		form: this, 
		    		frmID: this.frmID, 
		    		frmObj: 'frmBBLINE', 
		    		method: 'LoadObjBBLINE'
		    	});
	    	});

	    },
		// mounted() { console.log('TBLDSC mounted', 'Test 1222222') },	
		// beforeMount () { console.log('TBLDSC beforeMount', 'Test 22222') },		
		// updated() { console.log('TBLDSC updated', 'Test 123') },	
		// beforeUpdate () { console.log('TBLDSC beforeUpdate', 'Test 456') },			
		// activated () { console.log('TBLDSC activated', 'active') },
		// deactivated () { console.log('TBLDSC deactivated', 'active') },
		computed: {
	      	...mapGetters('App',['getAppForms']),
			myForm() {
				console.log('Masuk myForm TBLDSC');
				return this.getAppForms[this.frmID];
				// return [];
			},			
		},
		
		watch: {
			'myForm.Forms.frmBBHEAD.BADIVI.PopData': function (data) {
				if (data.length == undefined) {
					this.myForm.Forms['frm'+this.frmID].MCPCNOIY.PopSetValue({
	                    flag: true, iy: "", code: "", desc: "", data: {}                   
	                });
				} 
				this.myForm.Forms['frm'+this.frmID].MCPCNOIY.Condition = 
				" MFDIVI = '" + this.myForm.Forms['frm'+this.frmID].BADIVI.Value + "' "
			},
			'myForm.Forms.frmBBHEAD.BADEPT.PopData': function (data) {
				if (data.length == undefined) {
					this.myForm.Forms['frm'+this.frmID].BACCNOIY.PopSetValue({
	                    flag: true, iy: "", code: "", desc: "", data: {}                   
	                });
				} 
				this.myForm.Forms['frm'+this.frmID].BACCNOIY.Condition = 
				" MCDEPT = '" + this.myForm.Forms['frm'+this.frmID].BADEPT.Value + "' And " +
				" MCPCNOIY = '" + this.myForm.Forms['frm'+this.frmID].MCPCNOIY.Value + "' "
			},			
			'myForm.Forms.frmBBHEAD.MCPCNOIY.PopData': function (data) {
				// console.log('MCPCNOIY.PopData ' + data.length , data)
				if (data.length == undefined) {
					this.myForm.Forms['frm'+this.frmID].BACCNOIY.PopSetValue({
	                    flag: true, iy: "", code: "", desc: "", data: {}                   
	                });
				} 
				this.myForm.Forms['frm'+this.frmID].BACCNOIY.Condition = 
				" MCDEPT = '" + this.myForm.Forms['frm'+this.frmID].BADEPT.Value + "' And " +
				" MCPCNOIY = '" + this.myForm.Forms['frm'+this.frmID].MCPCNOIY.Value + "' "
			},
			// 'myForm.Forms.frmBBHEAD.TDLGTH.Value': function (data) {
			// 	if (data != 0) {
			// 		this.myForm.Forms['frm'+this.frmID].TSSYCD.Min = 1;
			// 		this.myForm.Forms['frm'+this.frmID].TSSYCD.Max = Number(data);					
			// 	}
			// }

			'myForm.Forms.frmBBHEAD.BBLINE.Value': function (data) {
				let total = 0;
				let gridBBLINE = data;
				if(gridBBLINE != '') {
					for (let index in gridBBLINE) {
						total += Number(gridBBLINE[index].BBTOTL)
					}
				}
				this.myForm.Forms.frmBBHEAD.BATOTL.Value = total;
			},

		},
				
		methods: {
			// ...mapMutations('App',['setAppForms_Data']),
			// ...mapActions('App',['doAppLoadObject']),
			CommandClick: function (mode) {
				if (mode != "") {
					switch(mode) {
					    case "1": // Add
							auth.actionForm({form: this, mode: mode});	
					    	// alert('masuk sini');
					    	break;
					    case "2": // Edit
					    case "6": // View
					    	auth.fillFormObject({form: this, mode: mode});
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
					    	// console.log('Begin Saving Data')
					    	auth.saveData({
					    		form: this, 
					    		frmID: this.frmID, 
					    		frmObj: 'frm' + this.frmID,
					    	})
					    	// console.log('End Saving Data')
					    	return;
					    	break;
					    case "5": // Cancel		
							auth.actionForm({form: this, mode: mode});	
					        break;			        
					}					
				}

			},

			DetailCommandClick: function (mode) {
				var frmHeader = this.myForm.Forms['frm'+this.frmID];
				var frmDetail = this.myForm.Forms['frm'+this.frmID].BBLINE;
				// console.log('add mode : ', mode);
				if (mode != "") {
					switch(mode) {
					    case "1": // Add
					    	// frmDetail.ShowPopUpModal = true;
					    	if (frmHeader.BAREMK.Value === "") {
					    		console.log('Remark harus diisi dulu');
					    		this.$q.notify('Remark harus diisi duulu (ini hanya contoh) ');
					    		frmDetail.ShowPopUpModal = false;
					    	}
					    	break;
					    case "2": // Edit
					    	// frmDetail.ShowPopUpModal = true;
					    	break;
					    case "3": // Delete
					    	auth.saveDataDetail({
					    		form: this, 
					    		frmID: this.frmID, 
					    		frmObj: 'frmBBLINE',
					    		frmGridPath: 'frm'+this.frmID+'.BBLINE',
					    		mode: '3'
					    	});
					    	return;
					        break;
					    case "insert": // insert
					    	auth.saveDataDetail({
					    		form: this, 
					    		frmID: this.frmID, 
					    		frmObj: 'frmBBLINE',
					    		frmGridPath: 'frm'+this.frmID+'.BBLINE',
					    		mode: '1'
					    	});
					    	break;
					    case "update": // insert
					    	auth.saveDataDetail({
					    		form: this, 
					    		frmID: this.frmID, 
					    		frmObj: 'frmBBLINE',
					    		frmGridPath: 'frm'+this.frmID+'.BBLINE',
					    		mode: '2'
					    	}).then((response) => {
					    		if (response.flagConfirm) {
						    		frmDetail.ShowPopUpModal = false;
					    		}
					    	});					    		
					    	break;
					    case "5": // Cancel
					    	// frmDetail.ShowPopUpModal = false;
					        break;
					    case "6": // View
					    	break;					        
					}					
				}

			},

		},			
		data () {
			return {
  				frmID: 'TBLDSCXXXX',
	      	}
	    }
	}
</script>
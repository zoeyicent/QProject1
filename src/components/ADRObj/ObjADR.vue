<template>
<!-- 
	class="q-pa-xs"

	beda v-model dan value adalah
		v-model : bisa ambil nilainya (saat ketik)
		value   : tidak bisa ambil nilainya (saat ketik)


			v-model="ObjADR" 
			value="pObj.Value" 
			:stack-label="pObj.Name"  
				:max="pObj.Max === '' ? 0 : pObj.Max"
				:min="pObj.Min === '' ? 0 : pObj.Min"

			<q-input 
				v-model="ObjADR" 
				:float-label="pObj.Name" 
				:placeholder="pObj.Description === '' ? pObj.Name : pObj.Description"
				@keydown="onKeyDown"
				@blur="onLostFocus"
			/>		
		Show : ({{ pObj.Show }})
  :error="ErrorObj"
  :error-label="ErrorObj === true ? ErrorLabel : ''"
 -->

<q-field v-show="pObj.Show" 
  :label="pObj.Title"
  :icon="pObj.Icon"
  :helper="pObj.Helper"
  :error="$v.ObjADR.$error"
  :error-label="ErrorLabel"
  :orientation="pObj.Orientation === '' ? 'horizontal' : pObj.Orientation"
  class="myobj"
>
	<!-- <slot></slot> -->
<!--
***************************************************  
************BEGIN OBJECT TEXT
***************************************************  
												--> 
	<div v-if="pObj.Tipe=='txt'">  	
		<q-input 
			v-model="ObjADR" 
			:ref="'ref'+pObj.Code"
			:float-label="pObj.Name" 
			:placeholder="pObj.Description === '' ? pObj.Name : pObj.Description"
			:upper-case="Capital.big"
			:lower-case="Capital.small"
			:prefix="pObj.Prefix"
			:suffix="pObj.Suffix"
			:readonly="pObj.ReadOnly"
			:inverted-light="pObj.ReadOnly"
			:color="WarnaReadOnly"
			@keydown="onKeyDown"
			@blur="onLostFocus"
			@input="$v.ObjADR.$touch"
		/>
	</div>
<!--
***************************************************  
************END OBJECT TEXT
***************************************************  
												-->	
<!--
***************************************************  
************BEGIN OBJECT PASSWORD
***************************************************  
  												--> 
	<div v-else-if="pObj.Tipe=='pwd'">  	
		<q-input
			type="password" no-pass-toggle
			v-model="ObjADR" 
			:ref="'ref'+pObj.Code"
			:float-label="pObj.Name" 
			:placeholder="pObj.Description === '' ? pObj.Name : pObj.Description"
			:readonly="pObj.ReadOnly"
			:inverted-light="pObj.ReadOnly"
			:color="WarnaReadOnly"
			@input="$v.ObjADR.$touch"
		/>
	</div>
<!--
***************************************************  
************END OBJECT PASSWORD
***************************************************  
  												--> 	
<!--
***************************************************  
**********BEGIN OBJECT DATETIME
***************************************************  
  												--> 
	<div v-else-if="pObj.Tipe=='dtp'">  	
		<q-datetime
			style="padding-bottom: 2px"
			v-model="ObjADR" 
			:ref="'ref'+pObj.Code"
			:float-label="pObj.Name" 
			:placeholder="pObj.Description === '' ? pObj.Name : pObj.Description"
			:readonly="pObj.ReadOnly"
			:inverted-light="pObj.ReadOnly"
			:color="WarnaReadOnly"
			@input="$v.ObjADR.$touch"
			:type="pObj.DateType"
			:format="pObj.FormatDisplay"
		/>
	</div>
<!--
***************************************************  
**********END OBJECT DATETIME
***************************************************  
  												--> 
<!--
***************************************************  
**********BEGIN OBJECT FILE
***************************************************  
  												--> 
	<div v-else-if="pObj.Tipe=='fle'">  
		<q-uploader
			:ref="'ref'+pObj.Code"
			:float-label="pObj.Name" 
			:placeholder="pObj.Description === '' ? pObj.Name : pObj.Description"
			:readonly="pObj.ReadOnly"
			:inverted-light="pObj.ReadOnly"
			:color="WarnaReadOnly"
			@input="$v.ObjADR.$touch"
			:url="url" 
			hide-upload-button
			hide-upload-progress
			:extensions="pObj.Extensions"
			:multiple="pObj.Multiple"
			auto-expand
			@add="addFile"
			@remove:cancel="addFile"
			:after="[{icon: 'cloud_download', handler () { downloadFiles() }}]"
		/>
		<q-input
			v-show="false" 
			v-model="ObjADR" 
			float-label="Data Files" 
			readonly
			inverted-light
			color="grey-6"
		/>
	</div>
<!--
***************************************************  
**********END OBJECT FILE
***************************************************  
  												--> 
<!--
***************************************************  
**********BEGIN OBJECT NUMERIC
***************************************************  
  												--> 

	<div v-else-if="pObj.Tipe=='num'">  	
		<q-input 
			type="number" align="right" 
			v-model="ObjADR" 
			:ref="'ref'+pObj.Code"
			:float-label="pObj.Name" 
			:placeholder="pObj.Description === '' ? pObj.Name : pObj.Description"
			:decimals="pObj.Decimal"
			:step="pObj.Step"
			:prefix="pObj.Prefix"
			:suffix="pObj.Suffix"
			:readonly="pObj.ReadOnly"
			:inverted-light="pObj.ReadOnly"
			:color="WarnaReadOnly"
			@input="$v.ObjADR.$touch"
		/>
	</div>	
<!--
***************************************************  
**********END OBJECT NUMERIC
***************************************************  
  												--> 
<!--
***************************************************  
**********BEGIN OBJECT REMARK
***************************************************  
  												--> 
	<div v-else-if="pObj.Tipe=='rmk'" >  	
		<q-input 
			type="textarea"
			v-model="ObjADR" 
			:ref="'ref'+pObj.Code"
			:float-label="pObj.Name" 
			:placeholder="pObj.Description === '' ? pObj.Name : pObj.Description"
			:readonly="pObj.ReadOnly"
			:inverted-light="pObj.ReadOnly"
			:color="WarnaReadOnly"
			:max-height="pObj.Height"
			@input="$v.ObjADR.$touch"
		/>
	</div>	
<!--
***************************************************  
**********EBD OBJECT REMARK
***************************************************  
  												--> 
<!--
***************************************************  
**********BEGIN OBJECT COMBO / SELECTION
***************************************************  
  												--> 
	<div v-else-if="pObj.Tipe=='cmb'" >  	
		<q-select 
			:radio="JenisSelection.radio"
			:multiple="JenisSelection.multi"
			v-model="ObjADR" 
			:ref="'ref'+pObj.Code"
			:float-label="pObj.Name" 
			:placeholder="pObj.Description === '' ? pObj.Name : pObj.Description"
			:readonly="pObj.ReadOnly"
			:inverted-light="pObj.ReadOnly"
			:color="WarnaReadOnly"
			:options="pObj.Options"  
			@input="$v.ObjADR.$touch"
		/>
	</div>	
<!--
***************************************************  
**********BEGIN OBJECT COMBO / SELECTION
***************************************************  
  												--> 

<!--
***************************************************  
**********BEGIN OBJECT RADIO BUTTON
***************************************************  
  												--> 
	<div v-else-if="pObj.Tipe=='rad'" >  
		<q-option-group 
			:type="pObj.Jenis"
			v-model="ObjADR" 
			:ref="'ref'+pObj.Code"
			:readonly="pObj.ReadOnly"
			:inverted-light="pObj.ReadOnly"
			:color="WarnaReadOnly"
			:options="pObj.Options" 
			@input="$v.ObjADR.$touch"
		/>
	</div>
<!--
***************************************************  
**********END OBJECT RADIO BUTTON
***************************************************  
  												--> 
<!--
***************************************************  
**********BEGIN OBJECT TOOGLE
***************************************************  
**********value nya harus true or false
***************************************************  
  												--> 
	<div v-else-if="pObj.Tipe=='tog'" >  
		<q-toggle
			v-model="ObjADR" 
			:ref="'ref'+pObj.Code"
			:left-label="pObj.Left"
			:readonly="pObj.ReadOnly"
			:inverted-light="pObj.ReadOnly"
			:color="WarnaReadOnly"
			:label = "pObj.Name" 
			@input="$v.ObjADR.$touch"
		/>
	</div>	
<!--
***************************************************  
**********END OBJECT TOOGLE
***************************************************  
  												--> 
<!--
***************************************************  
************BEGIN OBJECT POPUP
***************************************************  
  												--> 
	<div v-else-if="pObj.Tipe=='pop'">  	
		<!--  

		-->
		<q-field 
			style="margin: 0"
			:helper="pObj.Pops[pObj.PopDesc].Value">
			<div class="row">
				<q-input 
					clearable
					:disable="pObj.Pops[pObj.PopCode+pObj.PopDesc].Disabled"
					:before="[{icon: 'search', handler () { if(!pObj.ReadOnly) { pObj.ShowPopUpModal = !pObj.ShowPopUpModal } }}]"
					v-model="pObj.Pops[pObj.PopCode+pObj.PopDesc].Value" 
					:ref="'ref'+pObj.Code+'search'"
					:float-label="pObj.Name" 
					:placeholder="pObj.Description === '' ? pObj.Name : pObj.Description"
					:readonly="pObj.ReadOnly"
					:inverted-light="pObj.ReadOnly"
					:color="WarnaReadOnly"
					@focus="pObj.Pops[pObj.PopCode].Value==='' ? '' : 
							pObj.Pops[pObj.PopCode+pObj.PopDesc].Value=pObj.Pops[pObj.PopCode].Value"
					@input="$v.ObjADR.$touch"
					@blur="popBlur"
					@keyup.enter="$refs['ref'+pObj.Code+'search'].blur()"
					class="col-12 "
				>

 					<!--  
 				-->
					<q-autocomplete
						@search="popAutoComplete"
						@selected="popSelected"
						value-field="label"						
						separator
						:min-characters="pObj.SearchChar"
					/> 

				</q-input>				
			</div>
		</q-field>

		<div class="row">
			<q-input class="col-xs-2" v-show="false" 
				v-model="ObjADR" 
				float-label="IY" 
				:ref="'ref'+pObj.Code"
				readonly
				inverted-light
				color="grey-6"
				@input="$v.ObjADR.$touch"
			/>
			<q-input class="col-xs-4" v-show="false" 
				v-model="pObj.Pops[pObj.PopCode].Value" 
				float-label="Code" 
				readonly
				inverted-light
				color="grey-6"
			/>
			<q-input class="col-xs-5" v-show="false" 
				v-model="pObj.Pops[pObj.PopDesc].Value" 
				float-label="Description" 
				readonly
				inverted-light
				color="grey-6"
			/>
		</div>

		<q-modal v-model="pObj.ShowPopUpModal" maximized class="q-ma-xl q-pa-xl" >
			<q-modal-layout v-if="pObj.ShowPopUpModal">

				<div class="row q-ma-md">
					<!-- <q-search
					hide-underline
					color="primary"
					v-model="popFilter"
					class="col-6"
					/> 
						<span 
							class="text-primary justify-end" 
							style="text-transform: uppercase; font-weight: bold; ">
						</span> 			

				-->
					<q-input
						class="col-xs-5 col-md-4"
						:before="[{icon: 'search', handler () { LoadDataGrid() }}]"
						placeholder="Search"
						v-model="pObj.Grid.SearchAllColumns"
						@keyup.enter="pObj.Grid.LoadDataGrid()"
					/>
					<div class="col-xs-7 col-md-8 text-primary text-right">
							{{ pObj.Name }}
							<!-- <span> {{ pObj.Description }} </span> -->
					</div>
				</div>

				<ObjGrid 
		            :frmID="frmID"
		            :subFrmID="'Forms.'+pFrmObj+'.'+pObj.Code+'.'"
		            frmType="popup"
            	/>
			</q-modal-layout>
		</q-modal>

	</div>
<!--
***************************************************  
************END OBJECT POPUP
***************************************************  
  												--> 

<!--
***************************************************  
**********BEGIN OBJECT TOOGLE
***************************************************  
  												--> 

<!-- 
					
 -->
	<div v-else-if="pObj.Tipe=='grd'" >  
		<div class="row">
			<div class="col-1">
				<q-btn 
					v-show="true" 
					v-if="pObj.Action.A.has === false ? false : true" 
					:disabled="pObj.Action.A.disabled === false ? false : true" 
					rounded dense
					class="q-ma-xs" 
					color="primary" icon="add"
					@click="CommandClick('1')"
				/>	
			</div>		
			<div class="col-11 text-right">
				{{ pObj.Description }}
			</div>
		</div>
		<ObjGrid 
            :frmID="frmID"
            :subFrmID="'Forms.'+pFrmObj+'.'+pObj.Code+'.'"
            frmType="GridDetail"
    	/>

		<q-modal 
			:ref="'ref'+pObj.Code"
			v-model="pObj.ShowPopUpModal"
			minimized
			no-backdrop-dismiss
			no-esc-dismiss
		>
			<q-modal-layout>
				<q-toolbar slot="header">
					<q-btn
						flat round dense
						@click="CommandClick('5')"
						icon="reply"
						wait-for-ripple
					/>
					<q-toolbar-title>
						{{ pObj.Description }}
					</q-toolbar-title>
					<q-btn v-show="true" flat round dense icon="add_to_photos" 
						@click="CommandClick('4')"/>
				</q-toolbar>

				<slot></slot>

			</q-modal-layout>
		</q-modal>

	</div>	
<!--
***************************************************  
**********END OBJECT TOOGLE
***************************************************  
  												--> 
</q-field>			
</template>

<script>

	function urltoFile(url, filename, mimeType){
		return (fetch(url)
			.then(function(res){return res.arrayBuffer();})
			.then(function(buf){return new File([buf], filename, {type:mimeType});})
		);
	}

	import api from 'src/api'
	import auth from 'src/auth/auth.vue';
	import { filter } from 'quasar'
	import { required, minLength, maxLength, alpha, minValue, maxValue } from 'vuelidate/lib/validators'
	import store from 'src/store'
	import ObjGrid from './ObjGrid.vue';
	import { mapGetters, mapMutations, mapActions } from 'vuex';

	export default { 
  		name: 'ObjADR',		
  		props: {
            pObj: { type : Object },
            pFrmObj: { type : String }
        },
  		components : {ObjGrid},	
		created () { 
			if (this.$parent.frmID === undefined) {
				this.frmID = this.getAppModules.GetMenuID(this.$route.name);
				/*
					Note : ini adalah event Object masuk ke <Slot>
				*/
			} else {
				this.frmID = this.$parent.frmID;
			}

			if (this.pObj.Tipe==="pop") {
				// console.log(this.pObj.Code , 'Forms.'+this.pFrmObj+'.'+this.pObj.Code+'.'+'Grid.PopSetValue');

				this.setAppForms_Data({
					id: this.frmID,
					path:'Forms.'+this.pFrmObj+'.'+this.pObj.Code+'.'+'PopSetValue',
					data: this.popSetValue});

			} else if (this.pObj.Tipe==="grd") {

				this.setAppForms_Data({
					id: this.frmID,
					path:'Forms.'+this.pFrmObj+'.'+this.pObj.Code+'.'+'CommandClick',
					data: this.CommandClick});

			}
			// console.log('ObjADR created', this.pObj);
			// console.log(this.pObj.Tipe + ' : ' + this.pObj.Name , this.ObjValidation);
		},
		// mounted() { console.log('ObjADR mounted', 'Test 1222222') },	
		// beforeMount () { console.log('ObjADR beforeMount', this) },		
		// updated() { console.log('ObjADR updated', 'Test 123') },	
		// beforeUpdate () { console.log('ObjADR beforeUpdate', 'Test 456') },			
		// activated () { console.log('ObjADR activated', 'Test 456')  },		
		// deactivated () { console.log('ObjADR deactivated', 'Test 456')  },		
		// watch: { },
		computed: { 
			...mapGetters('App',['getAppForms','getAppModules']),
			ObjADR: {
				get: function() {

					// Begin Clear
					switch(this.pObj.Tipe) {
						case 'fle':
							if(this.pObj.Value.length === 0){
								if(typeof(this.$refs['ref'+this.pObj.Code]) != 'undefined') {
									this.$nextTick(() => {
										this.$refs['ref'+this.pObj.Code].reset();
									})
								}
							} else {
								if(this.pObj.FileValue != ''){

									if (this.pObj.FileValue == 'tempVal') {
										this.pObj.FileValue = ''
										this.pObj.Value = ''
										return
									}

									var nilai = this.pObj.FileValue;
									var me = this;

									for (let child in nilai) {
										var tipeFile = nilai[child].split(';')[0].split(':')[1];

										urltoFile(nilai[child], 'file'+(Number(child)+1)+'.adr', tipeFile)
										.then(function(file){
											var fileList = [];
											fileList.push(file);
											me.$refs['ref'+me.pObj.Code].add(fileList);
										})
									}

									this.pObj.FileValue = ''
								} 
							}
							break;
					}
					// End Clear	

					return this.pObj.Value;
				},
				set: function(newValue) {
					this.pObj.Value = newValue;
				},
			},
			WarnaReadOnly() {
				return this.pObj.ReadOnly ? 'grey-6' : 'primary';
			},
			ErrorLabel () {
				// console.log(this.ObjADR);
				// console.log(this.pObj);
				// console.log(this.$v.ObjADR.minLength);
				if (this.pObj.Required) {
					if (!this.$v.ObjADR.required) {
						return 'This field is required.';
					}
				} 

				switch (this.pObj.Tipe) {
					case "txt":
					case "pwd":
						if (this.pObj.Min != 0) {
							if (!this.$v.ObjADR.minLength) {
								// return 'This field must have at least ' + this.pObj.Min + ' characters.';
								return 'Minimum ' + this.pObj.Min + ' characters.';
							} 
						} 
						if (this.pObj.Max != 0 ) {
							if (!this.$v.ObjADR.maxLength) {
								// return 'This field must have at most ' + this.pObj.Max + ' characters.';
								return 'Maximum ' + this.pObj.Max + ' characters.';
							}
						} 
						break;
					
					case "num":
						if (this.pObj.MinValue != 0) {
							if (!this.$v.ObjADR.minValue) {
								return 'Minimum value is ' + this.pObj.MinValue + '';
							}
						}
						if (this.pObj.MaxValue != 0)  {
							if (!this.$v.ObjADR.maxValue) {
								return 'Maximum value is ' +  this.pObj.MaxValue + '';
							}
						}	
						break;
				}

				return;

			},
			ObjValidations() {
				var Val = {}
				if (this.pObj.Required) {
					Val.required = required;
				}

				switch (this.pObj.Tipe) {
					case "num":
						if (this.pObj.MinValue != 0) {
							if (this.pObj.MinValue != 0) {
								Val.minValue = minValue(this.pObj.MinValue);
							}
						}
						if (this.pObj.MaxValue != 0)  {
							if (this.pObj.MaxValue != 0) {
								Val.maxValue = maxValue(this.pObj.MaxValue);
							}
						}					
						break;					
					case "cmb":
						this.JenisSelection.radio = this.pObj.Jenis === 'RADIO' ? true : false;
						this.JenisSelection.multi = this.pObj.Jenis === 'MULTIPLE' ? true : false;				
						break;
					case "txt":
						this.Capital.big = this.pObj.Capital === 'BIG' ? true : false;
						this.Capital.small = this.pObj.Capital === 'SMALL' ? true : false;	
					case "pwd":
						if (this.pObj.Min != 0) {
							if (this.pObj.Min != 0) {
								Val.minLength = minLength(this.pObj.Min);
							}
						}
						if (this.pObj.Max != 0) {
							if (this.pObj.Max != 0) {
								Val.maxLength = maxLength(this.pObj.Max);
							}
						}				
						break;
				}
				
				return Val;

			},
		},	
		validations() {
			// console.log('validations -> '+this.ObjABC) 
			return {
				ObjADR: this.ObjValidations 
			}
		},		
		methods: {			
			...mapMutations('App',['setAppForms_Data']),
			// ...mapActions('Grid',['doGridLoadData','doGridSelection','doGridTools','doGridTools_FSClick']),	
			touch() {
				this.$v.ObjADR.$touch();
			},
		    onKeyDown(e) {
		    },
		    onLostFocus() {
				this.$emit('eObjLostFocus');
			},

/*
------------------------------------------------------------------------------------------
------------------BEGIN object File-------------------------------------------------------
------------------------------------------------------------------------------------------
																						*/
			addFile () {
				this.$nextTick(() => {
					this.ObjADR = this.$refs['ref'+this.pObj.Code].files;
				})
			},
			downloadFiles () {
				let myFile = this.ObjADR;
				let link = document.createElement('a')

				for (var k in myFile) {
					var theFile = myFile[k];

					if(typeof(theFile) != 'undefined') {
						link.href = window.URL.createObjectURL(theFile)
						link.download = theFile.name
						link.click()
					} else {
						this.$q.notify('No File Selected!');
					}
				}
			},

/*
------------------------------------------------------------------------------------------
------------------End object File---------------------------------------------------------
------------------------------------------------------------------------------------------
																						*/


/*
------------------------------------------------------------------------------------------
------------------Begin object POPUP------------------------------------------------------
------------------------------------------------------------------------------------------
																						*/

			popBlur() {
				
				if ( this.pObj.Pops[this.pObj.PopCode+this.pObj.PopDesc].Disabled === true) {
					return;
				}

				if ( this.pObj.Pops[this.pObj.PopCode+this.pObj.PopDesc].Value === 
				     this.pObj.Pops[this.pObj.PopCode].Value && 
				     this.pObj.Pops[this.pObj.PopCode].Value != "") {

					// this.pObj.Pops[this.pObj.PopCode+this.pObj.PopDesc].Value = 
					// 				this.pObj.Pops[this.pObj.PopCode].Value + ' | ' +
					// 				this.pObj.Pops[this.pObj.PopDesc].Value;					
					return;
				}

				if ( this.pObj.Pops[this.pObj.PopCode+this.pObj.PopDesc].Value === "") {
					// this.pObj.Value = "";
					// this.pObj.Pops[this.pObj.PopCode].Value = "";
					// this.pObj.Pops[this.pObj.PopDesc].Value = "";	
					this.popSetValue({
						flag: true,  iy: "",  code: "",  desc: "", data: {}
					});

					return;
				}

				// if ( this.pObj.Pops[this.pObj.PopCode+this.pObj.PopDesc].Value === 
				//      this.pObj.Pops[this.pObj.PopCode].Value + ' | ' +
				//      this.pObj.Pops[this.pObj.PopDesc].Value ) {	
				// 	return;
				// }

				console.log('getRecord.....', this.pObj.PopCode.replace(this.pObj.Code+"_",""));

				var cari = [{ field: this.pObj.PopCode.replace(this.pObj.Code+"_",""), 
							  label: "", 
							  filterOperator: '=', 
							  filterValue: this.pObj.Pops[this.pObj.PopCode+this.pObj.PopDesc].Value
						    }];

				var params = new Object;
					params['Controller'] = 'c'+this.pObj.Controller;
					params['Method'] = this.pObj.Method;
					params['Condition'] = this.pObj.Condition;
					params['SubMethod'] = this.pObj.SubMethod;
					params['cari'] = cari;
					params['perPage'] = 0;
				this.pObj.Pops[this.pObj.PopCode+this.pObj.PopDesc].Disabled = true;
				api.fnRequestData (params, '').then((response) => {

					if(response.Data.data.length != 0) {
						var Data = response.Data.data[0];
						this.popSetValue({
							flag: true, 
							iy: Data[response.Key], 
							code: Data[this.pObj.PopCode.replace(this.pObj.Code+"_","")], 
							desc: Data[this.pObj.PopDesc.replace(this.pObj.Code+"_","")],
							data: Data
						});
					} else {
						this.popSetValue({ flag: false, iy: "", code: "", desc: "", data: {} });	
						// this.popSetValue({ flag: false, iy: "", code: "", desc: "", data: {} });	
					}
					this.pObj.Pops[this.pObj.PopCode+this.pObj.PopDesc].Disabled = false;
				}).catch((e) => {
					this.$q.notify({
						color: 'negative',
						position: 'top',
						message: 'Get Record PopUp Fail' + e,
						icon: 'report_problem'
					})
					this.pObj.Pops[this.pObj.PopCode+pObj.PopDesc].Disabled = false;
				});

			},
			popSetValue({flag, iy, code, desc, data }) {
				if (flag) {
					this.pObj.Value = String(iy).trim();
					this.pObj.Pops[this.pObj.PopCode].Value = String(code).trim();
					this.pObj.Pops[this.pObj.PopDesc].Value = String(desc).trim();
					// this.pObj.Pops[this.pObj.PopCode+this.pObj.PopDesc].Value = code + ' | ' + desc;
					this.pObj.Pops[this.pObj.PopCode+this.pObj.PopDesc].Value = String(code).trim();

					this.pObj.PopData = data;	
				} else {
					this.pObj.Value = "";
					this.pObj.Pops[this.pObj.PopCode].Value = "";
					this.pObj.Pops[this.pObj.PopDesc].Value = "";	
					this.pObj.PopData = {};				
				}
			},

			popSelected(item){		
				this.popSetValue({
					flag: true, 
					iy: item.value, 
					code: item.label, 
					desc: item.sublabel,
					data: item.data
				});
			},			
			popAutoComplete(terms, done) {
				

				var cari = [{ field: this.pObj.PopCode.replace(this.pObj.Code+"_",""), 
							  label: "", 
							  filterOperator: 'likeRight', 
							  filterValue: terms
						    }];

				var params = new Object;
					params['Controller'] = 'c'+this.pObj.Controller;
					params['Method'] = this.pObj.Method;
					params['Condition'] = this.pObj.Condition;
					params['SubMethod'] = this.pObj.SubMethod;					
					params['cari'] = cari;
					params['perPage'] = 0;

				api.fnRequestData (params, '').then((response) => {
					this.listData=[];
					for (let i in response.Data.data) {
						var code = response.Data.data[i][this.pObj.PopCode.replace(this.pObj.Code+"_","")];
						var desc = response.Data.data[i][this.pObj.PopDesc.replace(this.pObj.Code+"_","")];
						var label = code+' - '+desc

						this.listData.push({
							label: code , 
							sublabel: desc,
							value: response.Data.data[i][response.Key],
							text: code + ' | ' + desc,
							data: response.Data.data[i]
						})
					}
					done(filter(terms, {field: 'label', list: this.listData}))
				}).catch((e) => {
					this.$q.notify({
						color: 'negative',
						position: 'top',
						message: 'Get Record PopUp Fail ' + e,
						icon: 'report_problem'
					});
					done([]);
				});

			},

/*
------------------------------------------------------------------------------------------
------------------End object POPUP--------------------------------------------------------
------------------------------------------------------------------------------------------
																						*/




/*
------------------------------------------------------------------------------------------
------------------Begin object GridDetail-------------------------------------------------
------------------------------------------------------------------------------------------
																						*/
			CommandClick: function (mode) {
				if (mode != "") {
					switch(mode) {
					    case "1": // Add
					    	this.pObj.ShowPopUpModal = true;
					    	this.pObj.ActionMode = "1";
					    	auth.clearFormObject({
					    		form: this, 
					    		frmID: this.frmID, 
					    		frmObj: 'frm' + this.pObj.Code, 
					    		mode: '1'});
					    	break;
					    case "2": // Edit
					    	this.pObj.ShowPopUpModal = true;
					    	this.pObj.ActionMode = "2";
					    	// console.log(this.pObj.Grid.RowData);
					    	auth.fillFormObjectFromGrid({
					    		form: this, 
					    		frmID: this.frmID, 
					    		frmObj: 'frm' + this.pObj.Code, 
					    		data: this.pObj.Grid.RowData,
					    		mode: '2'
					    	});
					    	break;
					    case "3": // Delete
					        break;
					    case "4": // Save
							switch(this.pObj.ActionMode) {
								case "1":
									this.$emit('eFormDetail', 'insert');
									break;
								case "2":
									this.$emit('eFormDetail', 'update');
									break;
								case "3":
									this.$emit('eFormDetail', 'delete');
									break;
							}
							return;
					    	break;
					    case "5": // Cancel	
					    	this.pObj.ActionMode = "5";
					    	auth.clearFormObject({
					    		form: this, 
					    		frmID: this.frmID, 
					    		frmObj: 'frm' + this.pObj.Code, 
					    		mode: '5'});
					    	this.pObj.ShowPopUpModal = false;	
					        break;
					    case "6": // View
					    	break;					        
					}					
				}
				this.$emit('eFormDetail', mode);
			}

/*
------------------------------------------------------------------------------------------
------------------End object GridDetail---------------------------------------------------
------------------------------------------------------------------------------------------
																						*/


		},			
		data () {
			return {
				MaxChar : {type: Number, default: 0},
				MinChar : {type: Number, default: 0},
				JenisSelection : { radio : false, multi : false},
				Capital : { big : false, small : false},
				url: process.env.API,
				showModal: false,
				listData : [],
				frmID: '',
	      	}
	    }
	}
</script>
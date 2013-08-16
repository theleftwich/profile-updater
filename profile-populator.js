
////////////////////////////////////////////
//        variables
///////////////////////////////////////////

	
// sets html page variables to prevent 'undefined'	
var staffPageHTML = '';
var alumniPageHTML = '';
var studentPageHTML = '';
var facultyPageHTML = '';
var allPageHTML = '';
var frame_number = '2'; // this is the frame number for the TinyMCE HTML edit window. This seems to change. It is unpredictable. If the macro fails, try switching it to 2. :(	
	
// set profile buckets as array 
var profileBucketArray = ['https://caen-cms.engin.umich.edu/college/about/people/profiles/a-to-e',	
						 'https://caen-cms.engin.umich.edu/college/about/people/profiles/f-to-j',						 'https://caen-cms.engin.umich.edu/college/about/people/profiles/k-to-o',
						 'https://caen-cms.engin.umich.edu/college/about/people/profiles/p-to-t',
						 'https://caen-cms.engin.umich.edu/college/about/people/profiles/u-to-z',
						 ];



///////////////////////////////////////////////////////
//  outer loop
//  loops through profile buckets
///////////////////////////////////////////////////////
						 
for (j=0; j<5; j++){ // outer loop, loops through all 5 contact buckets. j<1 to test one bucket
	
	var bucket = profileBucketArray[j];
	iimSet('bucket',bucket);
	   iimPlay('profile-updater/go-to-bucket.iim');
	   
	   
		///////////////////////////////////////////////////////
		//  inner loop
		//  loops through published profiles in each bucket
		///////////////////////////////////////////////////////	   	   
	
	for (i=1; i<100; i++){ // use i<(arbitrarily large number) to make sure to get all profiles. Possible to replace with a do/while (see profile-populator-experimental.js), but I haven't gotten that working yet.
		
		
		// get profile name
		iimSet('i',i);
		iimSet('bucket',bucket);
		  iimPlay('profile-updater/get-profile-name.iim');
		  var name = iimGetLastExtract(); // get and store name
		
		// get profile URL
		iimSet('i',i);
		  iimPlay('profile-updater/get-profile-url.iim');
		  var url = iimGetLastExtract(); // Get and store URL of profile
		  
	
		// get profile snippet
		iimSet('i',i);
		  iimPlay('profile-updater/get-snippet.iim');
		  var snippet = iimGetLastExtract(); // Get and store html snippet
		  var snippet = snippet.replace('https://caen-cms.engin.umich.edu/', '/'); // truncates CMS urls to relative
		

			
			if (snippet.indexOf('#EANF#')>=0) // check to see if array is empty - i.e., there are no more snippets to get
				{
				break; // breaks loop
				}
		   
			else
			   
			   {
			   
			   // build content for alphabetical All Profiles page before the snippet is sorted into a category
			   allPageHTML += snippet; 
			   
			   // Sets variable {{url}} in iMacros			   			   
			   iimSet('url', url); 

			   // Runs macro to navigate to profile page and extract some HTML
			   iimPlay('get-profile-type.iim'); 
				   
			   // get profile header from macro, which includes profile type in text   
			   var profileHeader = iimGetLastExtract();


			   
	
				// process header to get profile type
				  
			   if (profileHeader.indexOf('Alumni') != -1) // check for 'Alumni' in header, if yes, then alumni
				   {
				   // alert(profileHeader); //testing
				   var profileType = 'alumni';
				   alumniPageHTML += snippet;
				   }
				   
			   if (profileHeader.indexOf('Faculty') != -1) // check for 'Faculty' in header, if yes, then faculty
				   {
				   //alert(profileHeader); //testing
				   var profileType = 'faculty';
				   facultyPageHTML += snippet;
				   // alert(profileType); //testing
				   }			   
				
			   if (profileHeader.indexOf('Staff') != -1)  // check for 'Staff' in header, if yes, then staff
				   {
				   //alert(profileHeader); //testing
				   var profileType = 'staff';
				   staffPageHTML += snippet;
				   }			
			
			   if (profileHeader.indexOf('Student') != -1)  // check for 'Student' in header, if yes, then student
				   {
				   //alert(profileHeader); //testing
				   var profileType = 'student';
				   studentPageHTML += snippet;
				   }
			   
			   }  // end else
		





	} // end i     
} // end j



//////////////////////////////////////////
//  create directory pages
/////////////////////////////////////////

// directory page URLs as array. TESTING - ON DEV
/*
var directoryPageArray = ['https://caen-cms-dev.engin.umich.edu/training/leftwich/profile-populator-test-folder/alumni',	
						 'https://caen-cms-dev.engin.umich.edu/training/leftwich/profile-populator-test-folder/faculty',
						 'https://caen-cms-dev.engin.umich.edu/training/leftwich/profile-populator-test-folder/staff',
						 'https://caen-cms-dev.engin.umich.edu/training/leftwich/profile-populator-test-folder/students',
						 'https://caen-cms-dev.engin.umich.edu/training/leftwich/profile-populator-test-folder/all-profiles'
						 ];	 // order important!


*/ 					 
// directory page URLs as array. FOR REAL - ON PRODUCTION
// order of these is important!	Order must match the order of categories in the directoryContentArray variable 
 var directoryPageArray = ['https://caen-cms.engin.umich.edu/college/about/people/profiles/alumni',	
 						 'https://caen-cms.engin.umich.edu/college/about/people/profiles/faculty',
 						 'https://caen-cms.engin.umich.edu/college/about/people/profiles/staff',
 						 'https://caen-cms.engin.umich.edu/college/about/people/profiles/students',
 						 'https://caen-cms.engin.umich.edu/college/about/people/profiles/all-profiles'
 						 ];	 					 

// create a variable to hold each profile type HTML as an object in an array. Order is important!
var directoryContentArray = [alumniPageHTML,facultyPageHTML,staffPageHTML,studentPageHTML,allPageHTML]; 						 


// loop through directory pages and populate them

for (k=0; k<6; k++){

	// get URL from directoryPageArray
	var directoryPageURL = directoryPageArray[k]; 

	//get content from directoryContentArray. Directory page and content changes with each loop, this why order in directoryPageArray is important.
	var pageContent = directoryContentArray[k];


	// set url variable in iMacros
	iimSet('directoryPageURL',directoryPageURL); 

	// set content variable in iMacros
	iimSet('pageContent',pageContent); 

	 // run macro to check out and populate directory page with extracted HTML
	iimSet('frame_number',frame_number);
	iimPlay('profile-updater/populate-directory-page.iim');

	// save html edit
	iimPlay('common/save-html-edit.iim'); 

	// save page
	iimPlay('common/save-page.iim');

	 // check in page
	iimPlay('common/check-in.iim'); 

} // end k loop



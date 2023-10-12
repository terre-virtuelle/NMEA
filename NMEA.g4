grammar NMEA;


nmea 
	: (sentence | EMPTY_LINE )* EOF
	;
sentence :  
        (aam | dbt | gga | gll | gsa | gsv | hdt | mwv | rmc | rsa | vhw | vtg | xdr)
        ;

 /** AAM - Waypoint Arrival Alarm */
aam     :
        DEVICE 'AAM'  SEP
        (LETTERS)* SEP
        (LETTERS)* SEP
        NUMBER* SEP
        (LETTERS)* SEP
        (LETTERS | NUMBER)*
        CHECKSUM
        ;
/** DBT - Depth Below Transducer, value expressed in feet, metres and fathoms. */ 
dbt     :
        DEVICE 'DBT'  SEP
        (SEP | (NUMBER SEP))
         LETTERS SEP
	(SEP | (NUMBER SEP))
        LETTERS SEP
	(SEP | (NUMBER SEP))
        LETTERS
        CHECKSUM
         ;
/**  GGA - essential fix data which provide 3D location and accuracy data */
gga     :
        DEVICE 'GGA'  SEP
        NUMBER* SEP
        NUMBER* SEP
        LETTERS* SEP
        NUMBER* SEP
        LETTERS* SEP
        ' '* 
        NUMBER* SEP
        NUMBER* SEP
        NUMBER* SEP
        SIGN* NUMBER* SEP
        LETTERS SEP
        SIGN* NUMBER* SEP 
        LETTERS* SEP+
        (NUMBER SEP)*          
        (LETTERS | NUMBER )* SEP*
        CHECKSUM
        ;
/** GLL : Geographic position, Latitude and Longitude */
gll     :
        DEVICE 'GLL'  SEP 
        NUMBER* SEP 
        LETTERS* SEP
        NUMBER* SEP 
        LETTERS* SEP 
        NUMBER* SEP 
        LETTERS SEP* 
        LETTERS* 
        CHECKSUM
        ;
/** GSA : Satellite status */
gsa 	:    
        DEVICE 'GSA'  SEP  
        LETTERS SEP 
        ' '*  NUMBER SEP
        (' '* NUMBER)* SEP
        (' '* NUMBER)* SEP
        (' '* NUMBER)* SEP
        (' '* NUMBER)* SEP
        (' '* NUMBER)* SEP
        (' '* NUMBER)* SEP
        (' '* NUMBER)* SEP
        (' '* NUMBER)* SEP
        (' '* NUMBER)* SEP
        (' '* NUMBER)* SEP
        (' '* NUMBER)* SEP
        (' '* NUMBER)* SEP
        (' '* NUMBER)* SEP
        (' '* NUMBER)* SEP
        (' '* NUMBER)*
        CHECKSUM
        ;

/** GSV : Satellites in view */
gsv	:   	
         DEVICE 'GSV' SEP
	(NUMBER | SEP)+ 
	CHECKSUM
        ;

/** HDT - Heading, True */ 
hdt     :
        DEVICE 'HDT'  SEP
        NUMBER SEP
        (LETTERS)*
        CHECKSUM
    ;

/** MWV - Wind Speed and Angle */ 
mwv     :
        DEVICE 'MWV'  SEP
        NUMBER SEP
        LETTERS SEP
        NUMBER SEP
        LETTERS SEP
        LETTERS
        CHECKSUM
    ;

/** RMC : Recommended Minimum sentence C */
rmc 	: 
        DEVICE 'RMC' SEP 
        NUMBER* SEP 
        LETTERS SEP 
        NUMBER* SEP 
        LETTERS* SEP 
        NUMBER* SEP 
        LETTERS* SEP 
        SIGN* NUMBER* SEP 
        NUMBER* SEP 
        NUMBER* SEP 
        NUMBER* SEP  
        LETTERS* ((SEP LETTERS)* | SEP*)
        CHECKSUM
       ;
/** RSA - Rudder Sensor Angle  */
rsa 	: 
        DEVICE 'RSA' SEP 
        (SIGNED | NUMBER) SEP
        LETTERS SEP
        NUMBER SEP
        LETTERS
        CHECKSUM
       ;

/** Water Speed and Heading */
vhw     :
        DEVICE 'VHW'  SEP
        ' '* (NUMBER)* SEP
        LETTERS* SEP
        ' '* (NUMBER)* SEP
        LETTERS* SEP
        ' '* (NUMBER)* SEP
        LETTERS* SEP
        ' '* (NUMBER)* SEP
        LETTERS*
        CHECKSUM
        ;

/** VTG - Course Over Ground and Ground Speed */
vtg 	:  
        DEVICE 'VTG' SEP
        ' '* (NUMBER)* SEP
        (LETTERS) SEP
        ' '* (NUMBER)* SEP
        (LETTERS) SEP
        ' '* (NUMBER)* SEP
        (LETTERS) SEP
        ' '* (NUMBER)* SEP
        (LETTERS SEP)*
        LETTERS*
        CHECKSUM    
        ;

//$GPXDR,A,0.6135744,D,PTCH,A,-0.6135744,D,ROLL*66
/** XDR - Transducer Measurements */
        xdr 	:  
        DEVICE 'XDR' SEP
        (LETTERS SEP (NUMBER | SIGNED ) SEP LETTERS SEP LETTERS SEP*)* 
        CHECKSUM    
        ;

DEVICE 	:	
  	'$' ('GP'|'II'|'AG'|'AI'|'AP'|'CC'|'CD'|'CS'|'CT'|'CV'|'CX'|'DF'|'EC'|'EP'|'ER'|'HC'|'HE'|'HN'|'IN'|'RA'|'SD'|'SM'|'SN'|'SS'|'TI'|'TR'|'VD'|'DM'|'VW'|'WI'|'YX'|'ZA'|'ZC'|'ZQ'|'ZV')
        ;
NUMBER
    :  
    '0'..'9'+
    |
    ('0'..'9')+ '.' ('0'..'9')* EXPONENT?
    |   '.' ('0'..'9')* EXPONENT?
    |   ('0'..'9')+ EXPONENT
   ;

EMPTY_LINE  :   ( ' '+
        | '\t'
        | '\r'
        | '\n'
        ) 
    ;
    
SEP :	(',')
    
    ;

SIGN : ('+'|'-')
     ;
     
SIGNED :
    SIGN? NUMBER+
	;
	
TIME_STAMP 
	:	
	'"' (LETTERS | NUMBER  | ':' | SIGN)+ '"'
	;	
CHECKSUM : (('*'('0'..'9')('0'..'9')) |
            ('*'('A'..'F')('0'..'9')) |
            ('*'('A'..'F')('A'..'F')) |
            ('*'('0'..'9')+('A'..'F')))
         ;   
 	
 LETTERS : (('A'..'Z')|('a'..'z')|' '|'~')+
          ;        
        

EXPONENT : ('e'|'E') ('+'|'-')? ('0'..'9')+ ;



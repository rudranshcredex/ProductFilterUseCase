public with sharing class getFieldsFromProduct {
    @AuraEnabled(cacheable=true)
    public static List<Product2> getFieldsFromProductMethod() {
        List<Product2> listOfFields = [select Type__c, name, Product_Family__c from Product2 where Type__c!=null];
        system.debug('list of Fields----->'+ listOfFields);
        return listOfFields;
    }
}
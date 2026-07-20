package com.cafevelours.order_service.repository;

import com.cafevelours.order_service.model.Discount;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface DiscountRepository extends MongoRepository<Discount, String> {

    //  → C'est une requête dérivée (Query Method) de Spring Data. Elle traduit automatiquement le nom de la méthode
    //    en requête MongoDB (BSON). Elle cherche tous les documents dont le montant minimum (`minAmount`) est inférieur
    //    ou égal (`LessThanEqual`) au montant du panier passé en paramètre. Ensuite, elle trie les résultats par ordre
    //    décroissant (`OrderByMinAmountDesc`) et ne récupère que le tout premier (`findFirst`), c'est-à-dire le palier de remise
    //    le plus avantageux pour le client.
    Optional<Discount> findFirstByMinAmountLessThanEqualOrderByMinAmountDesc(double amount);// Extraction dynamique du palier de réduction maximal applicable
}
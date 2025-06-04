package io.bootify.helisys.mapper;

import io.bootify.helisys.domain.AlmacenContenedor;
import io.bootify.helisys.domain.DetalleProductoModeloAeronave;
import io.bootify.helisys.domain.Producto;
import io.bootify.helisys.model.ProductResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;


import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface ProductoMapper {

    @Mapping(source = "proTpo.tpoNombreTipo", target = "proTpoNombre")
    @Mapping(source = "proAmc", target = "proAmcNombre", qualifiedByName = "mapAlmacenCombinado")
    @Mapping(source = "proPve.pveNombre", target = "proPveNombre")
    @Mapping(source = "dpmaProDetalleProductoModeloAeronaves", target = "modeloAeronaveNombres")
    ProductResponseDTO toDto(Producto producto);

    default List<String> mapModeloAeronaves(Set<DetalleProductoModeloAeronave> dpmas) {
        return dpmas.stream()
            .map(dpma -> dpma.getDpmaMre().getMreNombre())
            .toList();
    }

    @Named("mapAlmacenCombinado")
    default String mapAlmacenCombinado(AlmacenContenedor amc) {
        if (amc == null || amc.getAmcAmr() == null || amc.getAmcAmr().getAmrAmt() == null) {
            return null;
        }
        String descripcion = amc.getAmcAmr().getAmrAmt().getAmtDescripcion();
        String repisa = amc.getAmcAmr().getAmrNombre();
        String numero = amc.getAmcNumero();
        return descripcion +"-" + repisa + "-" + numero;
    }

}




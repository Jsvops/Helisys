package io.bootify.helisys.util;

import java.util.ArrayList;
import java.util.List;

public class PaginadorUtil {


    public static <T> List<List<T>> dividirBloques(List<T> lista, int tamañoBloque) {
        List<List<T>> bloques = new ArrayList<>();
        for (int i = 0; i < lista.size(); i += tamañoBloque) {
            bloques.add(lista.subList(i, Math.min(i + tamañoBloque, lista.size())));
        }
        return bloques;
    }
}

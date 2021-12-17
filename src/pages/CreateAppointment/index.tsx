import React, { useCallback, useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from "react-native";

import { Container, Header, BackButton, HeaderTitle, ProvidersListContainer, ProvidersList,
    ProviderContainer, UserAvatar, ProviderAvatar, ProviderName, Calendar, Title,
    OpenDatePickerButton, OpenDatePickerButtonText} from "./styles";
import { useAuth } from "../../hooks/Auth";
import api from "../../services/api";

interface RouteParams {
    providerId: string;
}
export interface Provider {
    id: string;
    name: string;
    avatar_url: string;
}
interface AvaliabilityItem {
    hour: number;
    avaliable: boolean;
}

const CreateAppointment: React.FC = () => {
    const { user } = useAuth();
    const route = useRoute();
    const { goBack } = useNavigation();

    const routeParams = route.params as RouteParams;

    const [avaliability, setAvaliability] = useState<AvaliabilityItem[] | any>([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [providers, setProvider] = useState<Provider[] | any>([]);
    const [selectedProvider, setSelectedProvider] = useState(routeParams.providerId);

    useEffect(() => {
    api.get('providers').then((response) => {
            setProvider(response.data);
        });
    }, []);   

    useEffect(() => {
        api.get(`providers/${selectedProvider}/day-avaliability`, {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
            }
        }).then(response => {
            setAvaliability(response.data);
        })
    }, [selectedDate, selectedProvider]);

    const navigateBack = useCallback(() => {
        goBack();
    }, [goBack]);

    const handleSelectProvider = useCallback((providerId: string) => {
        setSelectedProvider(providerId);
    }, []);

    const handleToggleDatePicker = useCallback(() => {
        setShowDatePicker((state) => !state);
    }, []);

    const handleDateChange = useCallback((event: any, date: Date | undefined) => {
        if(Platform.OS === 'android') {
            setShowDatePicker(false);
        }

        if(date) {
            setSelectedDate(date);
        }
    }, []);

    return (
        <Container>
            <Header>
                <BackButton onPress={navigateBack} >
                    <Icon name="chevron-left" size={24} color="#999591 "/>
                </BackButton>

                <HeaderTitle>Cabeto Carreiros</HeaderTitle>

                <UserAvatar source={{ uri: user.avatar_url }} /> 
            </Header>

            <ProvidersListContainer>
                <ProvidersList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={providers}
                    keyExtractor={(provider) => provider.id}
                    renderItem={({ item: provider}) => (
                        <ProviderContainer
                            onPress={() => handleSelectProvider(provider.id)}
                            selected={provider.id === selectedProvider}
                        >
                            <ProviderAvatar source={{ uri: provider.avatar_url }} />
                            <ProviderName
                                selected={provider.id === selectedProvider}
                            >{ provider.name }</ProviderName>
                        </ProviderContainer>
                    )}
                />
            </ProvidersListContainer>
            <Calendar>
                <Title>Escolha a data</Title>

                <OpenDatePickerButton onPress={handleToggleDatePicker} >
                    <OpenDatePickerButtonText>Selecionar outra data</OpenDatePickerButtonText>
                </OpenDatePickerButton>

                {showDatePicker && (
                    <DateTimePicker 
                    mode='date' 
                    onChange={handleDateChange}
                    display="calendar" 
                    value={selectedDate} 
                />
                )}
            </Calendar>
        </Container>
    )
};

export default CreateAppointment;